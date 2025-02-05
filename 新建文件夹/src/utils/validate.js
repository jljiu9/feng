// 手机号验证
export const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 邮箱验证
export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

// 身份证验证
export const isValidIdCard = (idCard) => {
  return /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard)
}

// URL验证
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 密码强度验证
export const checkPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}

// 银行卡号验证（Luhn算法）
export const isValidBankCard = (cardNo) => {
  const numbers = cardNo.replace(/\s/g, '').split('').reverse()
  let sum = 0
  
  for (let i = 0; i < numbers.length; i++) {
    let num = parseInt(numbers[i])
    if (i % 2 !== 0) {
      num *= 2
      if (num > 9) num -= 9
    }
    sum += num
  }
  
  return sum % 10 === 0
}

// 文件类型验证
export const isValidFileType = (filename, allowedTypes) => {
  const ext = filename.split('.').pop().toLowerCase()
  return allowedTypes.includes(ext)
}

// 文件大小验证（单位：MB）
export const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize * 1024 * 1024
}

// 中文姓名验证
export const isValidChineseName = (name) => {
  return /^[\u4e00-\u9fa5]{2,}$/.test(name)
}

// 邮政编码验证
export const isValidPostalCode = (code) => {
  return /^[1-9]\d{5}$/.test(code)
} 