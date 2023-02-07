import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component'
import { Check } from 'react-feather'
import colors from 'styles/colors'
import Copy from 'components/svg/Copy'
import { useEffect, useState } from 'react'

export default function TextCopyable({ text = '', className = '', timeout = 3000 }) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    setCopied(true)
  }

  useEffect(() => {
    let timer
    if (copied) {
      timer = setTimeout(() => setCopied(false), timeout)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [copied])

  return (
    <span className={className + ' flex items-center'}>
      <span className={'mr-1'}>{text}</span>
      <CopyToClipboard text={text} onCopy={onCopy} className='cursor-pointer inline-block'>
        {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
      </CopyToClipboard>
    </span>
  )
}
