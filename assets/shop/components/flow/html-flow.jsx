import React, { useImperativeHandle, useMemo } from 'react'
import FlowHeader from './header.jsx'
import FormInput, { FormInputType } from '../form-input.jsx'
import { flow } from './flow.jsx'

/**
 * HtmlFlow — safely render HTML stored in a variable
 *
 * Single input: `variable` (name of runner context variable holding HTML).
 * The variable's value is sanitized using custom DOM filtering and rendered directly
 * in the preview (not inside an iframe).
 */

const HtmlFlow = flow((props, ref) => {
  const { onPop, onUpdate, onPlay, onStop, isPlaying, data, clients } = props

  useImperativeHandle(ref, () => ({
    onSerialize: () => {
      return JSON.stringify([data?.variable, data?.html])
    },
    onDeserialize: (data) => {
      const [variable, html] = data ? JSON.parse(data) : [undefined, undefined]
      return { variable, html }
    },
    onCompile: () => {
      if (!data || !data.variable) {
        return ''
      }

      let html = data.html || ''
      html = JSON.stringify(html)

      return data.variable + ' = ' + html
    },
    onExecute: async (runner) => {
      if (data && data.variable) {
        let context = runner.getContext()
        if (context[data.variable]) {
          onUpdate({
            ...data,
            html: context[data.variable]
          })
        } else {
          return runner.run()
        }
      }
    }
  }), [data])

  const onChangeVariable = (variable) => onUpdate({ ...data, variable })

  const sanitizedHtml = (() => {
    const dirty = String(data?.html || '')
    if (!dirty) return ''

    // Custom sanitization for iframes - more permissive than DOMPurify
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = dirty

    // Remove potentially dangerous elements
    const dangerousElements = tempDiv.querySelectorAll('script, object, embed, form, input, button')
    dangerousElements.forEach(el => el.remove())

    // Clean up iframe attributes - only keep safe ones
    const iframes = tempDiv.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      // Remove potentially dangerous attributes
      const allowedAttrs = ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'sandbox']
      const attrsToRemove = []

      for (let attr of iframe.attributes) {
        if (!allowedAttrs.includes(attr.name)) {
          attrsToRemove.push(attr.name)
        }
      }

      attrsToRemove.forEach(attr => iframe.removeAttribute(attr))

      // Ensure src starts with https: or is a relative URL
      const src = iframe.getAttribute('src')
      if (src && !src.startsWith('https:') && !src.startsWith('/') && !src.startsWith('./')) {
        iframe.removeAttribute('src')
      }
    })

    return tempDiv.innerHTML
  })()

  return (
    <>
      <FlowHeader
        title="HTML"
        clients={clients}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onStop={onStop}
        onPop={onPop}
      />

      <form className="form-sm-horizontal">
        <FormInput
          id="variable"
          type={FormInputType.TEXT}
          label="Variable"
          value={data?.variable}
          onChange={onChangeVariable}
          help="Context variable containing HTML to display (sanitized)."
        />

        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Preview</label>
          <div className="col-sm-10" dangerouslySetInnerHTML={{ __html: sanitizedHtml }}>
          </div>
        </div>
      </form>
    </>
  )
})

export default HtmlFlow
