// 1. 在最外层初始化录音管理器
const recorderManager = wx.getRecorderManager();

import { BASE_URL } from '../../config/index'; 

Page({
  data: {
    // ... 你原本的各种数据
    isVirtualScene: false, // 核心开关：是否开启虚拟人场景
    latestAiMessage: '你好！我已经准备好了，请简单做一个自我介绍吧！', // 虚拟场景的顶部字幕
    targetJob: '通用岗位', // 新增：用来接收大厅传来的岗位
    inputValue: '',
    userRole: 'candidate', // 默认身份是求职者 ('candidate' | 'enterprise')
    customQuestions: '', // 企业专门配置的私人题库
    // 初始欢迎语
    chatHistory: [{ role: 'ai', content: '你好，我是面辅精灵！请先点击上方按钮上传你的简历，或者直接按住麦克风说话，我们开始模拟面试吧！' }],
    // 用于控制屏幕自动滚动的标记
    lastMessageId: '' ,
    isRecording: false, // <-- 新加这个：控制录音弹窗是否显示
    companyName: '', // 企业名称（HR 面试时使用）
  },
// 切换场景魔法
toggleScene() {
  this.setData({ isVirtualScene: !this.data.isVirtualScene });
  wx.showToast({ 
    title: this.data.isVirtualScene ? '已开启沉浸模式' : '已切回文字模式', 
    icon: 'none' 
  });
},

// 记录企业输入的专属题目
onCustomQuestionsInput(e: any) {
  this.setData({ customQuestions: e.detail.value });
},
  onLoad(options: any) {
    // 从 storage 读取岗位参数（switchTab 无法传参，求职者跳转时通过 storage 传递）
    const pendingJob = wx.getStorageSync('pendingJob') || options.job || '';
    if (pendingJob) {
      wx.removeStorageSync('pendingJob');
      this.setData({ targetJob: pendingJob });
      wx.showToast({ title: `已为您匹配【${pendingJob}】面试官`, icon: 'none', duration: 2000 });
    }

    // 【终极强壮版】监听录音停止并自动发送（完美兼容阿里云实时语音）
    recorderManager.onStop((res) => {
      const { tempFilePath } = res;
      wx.showLoading({ title: '正在转换文字...' });

      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (readRes) => {
          wx.request({
            url: `${BASE_URL}/speech-to-text`,
            method: 'POST',
            data: {
              audio_base64: readRes.data,
              format: 'mp3'
            },
            success: (reqRes: any) => {
              wx.hideLoading();
              try {
                const asrData = reqRes.data;
                const recognizedText = asrData.text || asrData.reply || asrData.transcription || '';
                if (recognizedText && recognizedText.trim().length > 0) {
                  this.setData({ inputValue: recognizedText.trim() }, () => { this.sendMessage(); });
                } else {
                  wx.showToast({ title: '没听清，请大声点', icon: 'none' });
                }
              } catch (e) {
                console.error('语音解析失败', reqRes.data);
                wx.showToast({ title: '语音解析出错了', icon: 'none' });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '语音识别连接失败', icon: 'none' });
            }
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '读取录音文件失败', icon: 'none' });
        }
      });
    });
  },

  // 每次页面显示时检测 HR 启动（每次都会检查 pendingHrStart，消费后即移除不会重复触发）
  onShow() {
    this.checkHrAutoStart();
  },

  // 检测是否从 HR 配置页跳转过来，自动启动面试
  checkHrAutoStart() {
    const pendingHrStart = wx.getStorageSync('pendingHrStart');
    if (!pendingHrStart) return;
    wx.removeStorageSync('pendingHrStart'); // 清除标记，防止重复触发

    const targetJob = wx.getStorageSync('targetJob') || '通用岗位';
    const customQuestions = wx.getStorageSync('customQuestions') || '';
    const companyName = wx.getStorageSync('companyName') || '';

    this.setData({
      userRole: 'hr',
      targetJob,
      customQuestions,
      companyName,
      chatHistory: [] // 清空默认欢迎语
    });

    wx.showLoading({ title: 'AI面试官准备中...' });

    wx.request({
      url: `${BASE_URL}/chat`,
      method: 'POST',
      data: {
        history: [{ role: 'user', content: '请开始面试' }],
        job: targetJob,
        role: 'hr',
        custom_questions: customQuestions
      },
      success: (res: any) => {
        wx.hideLoading();
        if (res.data && res.data.code === 200) {
          const aiReply = res.data.reply || '你好，请先做个自我介绍吧！';
          this.setData({
            chatHistory: [{ role: 'ai', content: aiReply }],
            latestAiMessage: aiReply
          });
        } else {
          wx.showToast({ title: 'AI启动失败，请重试', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '连接服务器失败', icon: 'none' });
      }
    });
  },

  // ================= 麦克风按键绑定 =================
  startRecord() {
    this.setData({ isRecording: true });
    recorderManager.start({
      duration: 60000, // 最长录音 60 秒
      sampleRate: 16000,
      numberOfChannels: 1,
      format: 'mp3'
    });
    wx.showToast({ title: '正在录音...', icon: 'none' });
  },

  stopRecord() {
    recorderManager.stop();
    this.setData({ isRecording: false });
  },

  // ================= 文本输入绑定 =================
  onInput(e: any) {
    this.setData({ inputValue: e.detail.value })
  },

  // ================= 发送消息与AI对话 =================
  sendMessage() {
    const question = this.data.inputValue.trim();
    if (!question) return; // 空消息不发

    // 1. 把用户的话加到界面上
    const updatedHistory = [...this.data.chatHistory, { role: 'user', content: question }];
    
    this.setData({
      chatHistory: updatedHistory,
      inputValue: '',
      lastMessageId: `msg-${updatedHistory.length - 1}` 
    });

    // 2. 记忆裁剪：【核心逻辑】只保留第1条（简历背景）和最近的5条对话
    // 防止大模型因为上下文太长而忘记一开始的简历设定
    let historyToSend = updatedHistory.length > 6 ? 
      [updatedHistory[0], ...updatedHistory.slice(-5)] : updatedHistory;

    // 3. 请求后端 AI 进行对话
    wx.request({
      url: `${BASE_URL}/chat`, 
      method: 'POST',
      data: { history: historyToSend,job: this.data.targetJob || wx.getStorageSync('targetJob') || '通用岗位',
      role: this.data.userRole || wx.getStorageSync('userRole') || 'candidate',
      custom_questions: this.data.customQuestions || wx.getStorageSync('customQuestions') || ''
       }, 
      success: (res: any) => {
        if (res.data && res.data.code === 200) {
          const aiReply = res.data.reply || "我好像走神了，请再说一遍。";
          // 👉 2. 【关键一击！把这行代码粘贴在这里】：
          this.setData({ latestAiMessage: aiReply });

          const finalHistory = [...this.data.chatHistory, { role: 'ai', content: aiReply }];
          // ================= 【打字机特效核心区】 =================
          // 1. 先给聊天框里塞一个“空”的 AI 气泡占位
          const newMsgIndex = this.data.chatHistory.length; 
          this.setData({
            chatHistory: [...this.data.chatHistory, { role: 'ai', content: '' }],
            lastMessageId: `msg-${newMsgIndex}` // 滚动到最底部
          });

          // 2. 开启定时器，像真人敲键盘一样，一个字一个字地往气泡里填！
          let currentText = '';
          let charIndex = 0;
          
          const typeTimer = setInterval(() => {
            if (charIndex < aiReply.length) {
              currentText += aiReply[charIndex];

              // 每3个字符批量更新一次，减少渲染频率
              if (charIndex % 3 === 0 || charIndex >= aiReply.length - 1) {
                this.setData({
                  [`chatHistory[${newMsgIndex}].content`]: currentText,
                  lastMessageId: `msg-${newMsgIndex}`
                });
              }
              charIndex++;
            } else {
              clearInterval(typeTimer);
            }
          }, 50);  // 增大到50ms，减少渲染频率
          // =======================================================
        } else {
          wx.showToast({ title: 'AI思考失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '连接服务器失败', icon: 'none' });
      }
    });
  },
// ================= 无缝重开一局 =================
restartInterview() {
  // 1. 弹个窗确认一下，防止用户手滑误触导致辛辛苦苦聊的记录没了
  wx.showModal({
    title: '重新开始面试',
    content: '确定要清空当前的对话进度，重新开启一轮面试吗？',
    confirmColor: '#ff4d4f', // 把确定按钮变成警示红
    success: (res) => {
      if (res.confirm) {
        // 2. 如果点击确定，立刻时光倒流！
        // 根据当前选定的岗位，动态生成全新的打招呼语
        const initialMsg = `你好！我是你的【${this.data.targetJob}】专属面试官。我已经准备好了，请先简单做一个自我介绍吧！`;
        
        this.setData({
          // 核心魔法：把聊天数组直接强行清空，只塞入这一条开场白！
          chatHistory: [{ role: 'ai', content: initialMsg }],
          lastMessageId: 'msg-0' // 滚动条重置到最上面
        });
        
        // 3. 弹个小提示庆祝一下
        wx.showToast({ title: '场景已重置', icon: 'success' });
      }
    }
  });
},
  // ================= 上传简历截图 =================
  uploadResume() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // ================= 【高科技障眼法核心】 =================
        // 在图片刚选完，系统开始疯狂转圈圈解析的时候，立刻在公屏打出这句话！
        const newMsgIndex = this.data.chatHistory.length;
        this.setData({
          chatHistory: [...this.data.chatHistory, {
            role: 'system',
            content: '✅ 视觉大模型已接收简历图像... 正在提取核心技能与过往经历... 面试引擎已就绪！'
          }],
          lastMessageId: `msg-${newMsgIndex}` // 滚动到底部
        });
        // =======================================================

        wx.showLoading({ title: 'AI正在阅读简历...' });

        wx.uploadFile({
          url: `${BASE_URL}/upload-resume`,
          filePath: tempFilePath,
          name: 'file',
          success: (uploadRes) => {
            wx.hideLoading();
            try {
              const data = JSON.parse(uploadRes.data);
              if (data.code === 200) {
                const aiReply = data.reply || "简历已收到，请做个自我介绍吧！";
                const newHistory = [...this.data.chatHistory, { role: 'ai', content: aiReply }];

                this.setData({
                  chatHistory: newHistory,
                  lastMessageId: `msg-${newHistory.length - 1}`
                });
              } else {
                wx.showToast({ title: '简历解析失败', icon: 'none' });
              }
            } catch (e) {
              wx.showToast({ title: '数据格式异常', icon: 'none' });
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '上传图片失败', icon: 'none' });
          }
        });
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '权限提示',
            content: '请授权访问相册以上传简历',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          wx.showToast({ title: '选择图片失败', icon: 'none' });
        }
      }
    });
  },
  // ================= 一键生成面试评估报告 =================
  generateReport() {
    // 如果聊天记录只有1条（只有开场白），说明还没开始聊
    if (this.data.chatHistory.length <= 1) {
      wx.showToast({ title: '还没有聊天记录哦', icon: 'none' });
      return;
    }

    wx.showLoading({ title: 'HR总监正在写报告...' });

    // 把所有的聊天记录都发给后端去总结
    wx.request({
      url: `${BASE_URL}/generate-report`, 
      method: 'POST',
      data: {
        history: this.data.chatHistory,
        job: this.data.targetJob  // 核心：多传一个 job 给后端！
      }, 
      success: (res: any) => {
        wx.hideLoading();
        if (res.data && res.data.code === 200) {
          const reportText = res.data.report || "报告生成出现异常，请稍后再试。";
          
          // 1. 把报告显示在聊天界面最下方
          const finalHistory = [...this.data.chatHistory, { role: 'ai', content: reportText, isReport: true }];
          this.setData({
            chatHistory: finalHistory,
            lastMessageId: `msg-${finalHistory.length - 1}`
          });
          
          // ================= 【核心绝杀：数据存储闭环】 =================
          // 2. 从报告里提取四个维度分数，取平均值
          let scoreNum = 80; // 默认保底分
          const dims = ['逻辑思维', '内容深度', '表达流畅度', '岗位匹配度'];
          const scores: number[] = [];
          for (const dim of dims) {
            const m = reportText.match(new RegExp(dim + '.*?(\\d{1,3})'));
            if (m) scores.push(parseInt(m[1], 10));
          }
          if (scores.length >= 2) {
            scoreNum = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          }

          // 3. 获取当前时间
          const now = new Date();
          const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

          // 4. 从手机本地读取旧的记录，把这次的新战绩插到最前面，然后再存回去！
          let records = wx.getStorageSync('interviewRecords') || [];
          records.unshift({
            id: Date.now().toString(),
            companyName: wx.getStorageSync('companyName') || this.data.companyName || '',
            candidateName: wx.getStorageSync('candidateName') || '匿名求职者',
            jobTitle: this.data.targetJob,
            date: dateStr,
            score: scoreNum,
            userRole: this.data.userRole,
            chatHistory: this.data.chatHistory
          });
          wx.setStorageSync('interviewRecords', records);
          // 5. 同步到服务端，供 HR 跨设备查看
          wx.request({
            url: `${BASE_URL}/save-record`,
            method: 'POST',
            data: records[0],
            fail: () => console.log('服务端记录同步失败（不影响本地保存）')
          });
          // ==========================================================

          // 弹个窗庆祝一下
          wx.showModal({
            title: '面试结束',
            content: '您的专属面试评估报告已送达，请在聊天最下方查看！',
            showCancel: false
          });

        } else {
          wx.showToast({ title: '报告生成失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '连接服务器失败', icon: 'none' });
      }
    });
  }
})


