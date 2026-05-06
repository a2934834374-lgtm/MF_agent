import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

from fastapi import FastAPI, File, UploadFile
import dashscope
from pydantic import BaseModel
from typing import List
from openai import OpenAI
from dashscope.audio.asr import Recognition, RecognitionCallback, RecognitionResult

# DashScope (通义千问) — 用于视觉和语音
dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")
if not dashscope.api_key:
    raise RuntimeError("请设置环境变量 DASHSCOPE_API_KEY")

# DeepSeek — 用于对话和报告生成（OpenAI 兼容接口）
deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)
if not deepseek_client.api_key:
    raise RuntimeError("请设置环境变量 DEEPSEEK_API_KEY")

app = FastAPI()

class MessageItem(BaseModel):
    role: str
    content: str

class UserInput(BaseModel):
    history: List[MessageItem]
    job: str = "通用岗位"  # 新增：接收前端传来的岗位

@app.get("/")
def read_root():
    return {"message": "服务器运行中！"}

# ================= 接口 A：文字聊天 (带记忆，升级为“真实面试官人设”) =================
@app.post("/chat")
def chat_with_ai(user_input: UserInput):
    # 强制 AI 扮演特定岗位的技术面试官
    system_prompt = (
        f"你现在是一位世界500强企业的资深HR与技术总监。候选人当前应聘的岗位是：【{user_input.job}】。\n"
        f"规则1：你的提问必须100%围绕【{user_input.job}】的专业技能、真实业务场景或该岗位所需的软技能展开，绝不能问无关问题！\n"
        "规则2：每次只问一个问题，根据用户的回答进行深度追问。\n"
        "规则3：语气要专业、干练，带有一点面试官的压迫感。"
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # 拼接历史记录
    for msg in user_input.history:
        role = "assistant" if msg.role == "ai" else msg.role
        messages.append({"role": role, "content": msg.content})
        
    response = deepseek_client.chat.completions.create(
        model='deepseek-chat',
        messages=messages,
    )
    if not response.choices:
        return {"code": 500, "error": "DeepSeek API 返回为空"}
    return {"code": 200, "reply": response.choices[0].message.content}


# ================= 接口 B：上传简历 (视觉大模型，升级为”精准破冰开场”) =================
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as f:
        f.write(await file.read())
    
    # 【核心升级：限制简历阅读时的输出格式】
    strict_prompt = (
        "你现在是一位资深HR面试官。请仔细阅读这份简历截图。"
        "然后以面试官的口吻跟我打个招呼，并根据简历里最亮眼的一段经历，向我提出第一个面试问题。"
        "【极其重要强制指令】："
        "1. 绝对不许总结、复述我的简历内容！"
        "2. 每次只允许问1个最核心的问题！"
        "3. 你的回复必须简短干练，就像真人在微信聊天一样。"
    )
    
    messages = [{"role": "user", "content": [{"image": f"file://{os.path.abspath(file_location)}"}, {"text": strict_prompt}]}]
    
    response = dashscope.MultiModalConversation.call(model='qwen-vl-plus', messages=messages)
    if response.status_code != 200:
        result = {"code": 500, "error": f"DashScope API 错误: {response.message}"}
    else:
        result = {"code": 200, "reply": response.output.choices[0].message.content[0]['text']}
    # 清理临时文件
    if os.path.exists(file_location):
        os.remove(file_location)
    return result


import asyncio

# ================== 1. 绝对无重叠、无丢失的顶级记录员 ==================
class SpeechAssistant(dashscope.audio.asr.RecognitionCallback):
    def __init__(self):
        super().__init__()
        self.sentences_dict = {} 
        self.is_finished = False

    def on_event(self, result):
        try:
            sentence = result.get_sentence()
            if sentence and isinstance(sentence, dict) and 'text' in sentence:
                text = sentence['text']
                
                # 🌟 绝杀破案：用“这句语音的起始时间戳”来当盒子编号！
                # 阿里云不给 sentence_id，但一定会给 begin_time。
                # 同一句话纠错100次，begin_time也是同一个，完美覆盖错别字草稿！
                # 新的一句话，begin_time肯定不同，安全放进新盒子！
                s_id = sentence.get('begin_time', 0)
                
                # 将文本放入对应时间戳的盒子中
                self.sentences_dict[s_id] = text
                
                print(f"🎤 阿里云 [时间戳 {s_id}]: {text}")
                
        except Exception as e:
            print(f"🚨 提取文字出错: {e}")

    def on_close(self):
        self.is_finished = True
        print("✅ 阿里云通道正式关闭，翻译彻底完成！")

    def on_error(self, message):
        self.is_finished = True
        print(f"🚨 阿里云报错了: {message}")

    def get_full_text(self):
        # 🌟 交差的时候，把时间戳从小到大排好队（保证说话先后顺序）
        sorted_keys = sorted(self.sentences_dict.keys())
        # 把所有定稿全拼起来！
        sorted_texts = [self.sentences_dict[k] for k in sorted_keys]
        return "".join(sorted_texts)
    
    # ================== 2. 语音转文字接口 ==================
@app.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    assistant = SpeechAssistant()
    recognition = dashscope.audio.asr.Recognition(
        model='paraformer-realtime-8k-v2',
        format='mp3',
        sample_rate=16000,
        callback=assistant
    )

    try:
        print("🎙️ 开始把语音发给阿里云...")
        recognition.start()
        with open(file_location, 'rb') as f:
            recognition.send_audio_frame(f.read())
        recognition.stop()
        
        # 🌟 核心修复3：死死等住！绝对不准提前抢跑！
        print("⏳ 正在等待阿里云把所有文字吐出来...")
        wait_time = 0
        while not assistant.is_finished and wait_time < 150: # 最多等 15 秒钟防卡死
            await asyncio.sleep(0.1)
            wait_time += 1

        # 等阿里云确认关闭通道了，再去拿字！
        text = assistant.get_full_text()
        print(f"--- 终极破案，识别成功： {text} ---")
        result = {"code": 200, "text": text}
    except Exception as e:
        print(f"--- 发生报错：{e} ---")
        result = {"code": 500, "error": str(e)}
    finally:
        # 清理临时文件
        if os.path.exists(file_location):
            os.remove(file_location)
    return result
    # ================= 接口 D：一键生成面试评估报告 =================
@app.post("/generate-report")
def generate_report(user_input: UserInput):
    # 1. 把你们刚才所有的聊天记录，拼接成一段完整的“面试录音稿”
    chat_content = "\n".join([f"{'面试官' if msg.role == 'ai' else '候选人'}: {msg.content}" for msg in user_input.history])
    
    # 2. 赋予 AI “HR 总监”的最高视角，并强制规范输出格式
    system_prompt = (
        f"你是一位极其严苛的面试评估专家。请根据以下候选人应聘【{user_input.job}】岗位的面试记录，出具一份极其专业的评估报告。\n"
        "必须严格按照以下 Markdown 格式输出，不要有任何废话：\n\n"
        "### 📊 一、 多维能力图谱 (满分100)\n"
        "- 逻辑思维：[XX]分 (理由...)\n"
        "- 内容深度：[XX]分 (理由...)\n"
        "- 表达流畅度：[XX]分 (理由...)\n"
        "- 岗位匹配度：[XX]分 (理由...)\n\n"
        "### 🎯 二、 逐题硬核复盘\n"
        "*(请针对面试中的核心问题，进行逐一分析)*\n"
        "【问题1】：(复述你问的问题)\n"
        "- 考察要点：(该问题想考察什么能力)\n"
        "- 候选人回答优劣：(指出他哪里答得好，哪里是扣分项)\n"
        "- 💡 满分回答模板：(给出一段可直接背诵的高级回答范例)\n\n"
        "【问题2】：(以此类推...)\n\n"
        "### 🚀 三、 终极改进建议\n"
        "(给出3条针对该岗位的实战训练建议)"
    )
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"以下是本次面试的对话记录：\n{chat_content}\n请立刻出具评估报告。"}
    ]
    
    try:
        # 召唤 DeepSeek 进行深度总结
        response = deepseek_client.chat.completions.create(
            model='deepseek-chat',
            messages=messages,
        )
        if not response.choices:
            return {"code": 500, "error": "DeepSeek API 返回为空"}
        report_text = response.choices[0].message.content
        
        print(f"--- 报告生成成功，即将发送给手机 ---")
        return {"code": 200, "report": report_text}
        
    except Exception as e:
        print(f"--- 报告生成报错：{e} ---")
        return {"code": 500, "error": str(e)} 