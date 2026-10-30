// 打开麦克风；失败时按原因给出能照着做的中文提示，并附上浏览器的错误代码，方便排查
export async function openMic() {
  if (!globalThis.isSecureContext) throw Object.assign(new Error('insecure'), { name: 'InsecureContext' })
  if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error('no getUserMedia'), { name: 'NoMediaDevices' })
  return navigator.mediaDevices.getUserMedia({ audio: true })
}

// 浏览器记下的这个网站的麦克风权限：granted / denied / prompt；浏览器不支持查询时返回 ''
export async function micState() {
  try {
    return (await navigator.permissions?.query({ name: 'microphone' }))?.state || ''
  } catch {
    return ''
  }
}

// NotAllowedError 分两种：浏览器禁止了这个网站（不会再弹窗），和手机系统没给浏览器 App 权限（信息里带 system）
const SITE_BLOCKED = '浏览器禁止了这个网站用麦克风，所以不再弹窗询问。点地址栏左边的图标 → 权限 → 麦克风 → 允许，再刷新页面'
const APP_BLOCKED = '手机没给浏览器这个 App 麦克风权限。到手机「设置」里找到这个浏览器，打开麦克风权限，再刷新页面'

const TEXT = {
  InsecureContext: '要用 https:// 开头的地址打开才能录音',
  NoMediaDevices: '这个浏览器不支持网页录音，换一个浏览器试试',
  NoMediaRecorder: '这个浏览器不支持网页录音，换一个浏览器试试',
  SecurityError: '浏览器的安全设置不让这个网页录音',
  NotFoundError: '没找到麦克风',
  NotReadableError: '麦克风被别的 App 占着（比如通话、录音），关掉后再试',
  AbortError: '麦克风被别的 App 占着（比如通话、录音），关掉后再试',
}

// { text, code }：text 给孩子和家长看，code 是浏览器原始的错误名和信息
export function micHint(err) {
  const name = err?.name || 'Error'
  const message = err?.message || ''
  const denied = name === 'NotAllowedError' || name === 'PermissionDeniedError'
  return {
    text: denied ? (/system/i.test(message) ? APP_BLOCKED : SITE_BLOCKED) : TEXT[name] || '打不开麦克风，刷新页面再试一次',
    code: [name, message].filter(Boolean).join(': '),
  }
}

// 这些识别错误说明浏览器的语音识别这次用不了（不是没听清），改成录音自己打分
export const RECOGNIZER_BROKEN = ['not-allowed', 'service-not-allowed', 'language-not-supported', 'audio-capture', 'network']
