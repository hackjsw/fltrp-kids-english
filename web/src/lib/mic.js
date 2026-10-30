// 打开麦克风；失败时按原因给出能照着做的中文提示，并附上浏览器的错误代码，方便排查
export async function openMic() {
  if (!globalThis.isSecureContext) throw Object.assign(new Error('insecure'), { name: 'InsecureContext' })
  if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error('no getUserMedia'), { name: 'NoMediaDevices' })
  return navigator.mediaDevices.getUserMedia({ audio: true })
}

const TEXT = {
  InsecureContext: '要用 https:// 开头的地址打开才能录音',
  NoMediaDevices: '这个浏览器不支持网页录音，换一个浏览器试试',
  NoMediaRecorder: '这个浏览器不支持网页录音，换一个浏览器试试',
  NotAllowedError: '浏览器没拿到麦克风权限。除了网页弹出的允许，还要到手机「设置」里给浏览器这个 App 打开麦克风权限，然后刷新页面',
  PermissionDeniedError: '浏览器没拿到麦克风权限。除了网页弹出的允许，还要到手机「设置」里给浏览器这个 App 打开麦克风权限，然后刷新页面',
  SecurityError: '浏览器的安全设置不让这个网页录音',
  NotFoundError: '没找到麦克风',
  NotReadableError: '麦克风被别的 App 占着（比如通话、录音），关掉后再试',
  AbortError: '麦克风被别的 App 占着（比如通话、录音），关掉后再试',
}

// { text, code }：text 给孩子和家长看，code 是浏览器原始的错误名和信息
export function micHint(err) {
  const name = err?.name || 'Error'
  return {
    text: TEXT[name] || '打不开麦克风，刷新页面再试一次',
    code: [name, err?.message].filter(Boolean).join(': '),
  }
}

// 这些识别错误说明浏览器的语音识别本身用不了（不是没听清），改成录音自己打分
export const RECOGNIZER_BROKEN = ['not-allowed', 'service-not-allowed', 'language-not-supported', 'audio-capture', 'network']
