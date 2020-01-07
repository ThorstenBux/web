// require('!style-loader!css-loader!../fonts/fonts.css')
// require('!style-loader!css-loader!./runtime-error-module.css')

// const html = require('./runtime-error-module.html')
const html = `
<div id="runtimeErrorContainer" class="absolute-fill">
  <div id="error_msg_unknown" class="hidden">
    <div class="error-text-outer-container">
      <div class="error-text-container error-margin-top-5">
        <p><img height="75px" src="//cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png" class="floater"></p>
        <div class="error-text-header">Oops, something went wrong!</div>
        <div class="error-text-hint">
          <p id="error_unknown_detail" />
        </div>
      </div>
    </div>
  </div>
</div>
`

const { XR8 } = window

const create = () => {
  let started = false
  const pipelineModule = () => ({
    name        : 'error',
    onStart     : () => { started = true },
    onException : (error) => {
      // Only handle errors while running, not at startup.
      if (!started) { return }

      // Only add the error message once.
      if (document.getElementById('error_msg_unknown')) { return }

      // Log the error to the console to help with debugging.
      console.log('[RuntimeError] XR caught an error; stopping:')
      console.log(error)

      // Show the error message.
      const e = document.createElement('template')
      e.innerHTML = html.trim()
      document.getElementsByTagName('body')[0].appendChild(e.content.firstChild)
      document.getElementById('error_msg_unknown').classList.remove('hidden')

      // Stop camera processing.
      XR8.pause()
      XR8.stop()
    }
  })

  return {
    // Adds a pipeline module that displays an error image and stops the camera
    // feed when an error is encountered after the camera starts running.
    pipelineModule
  }
}

let runtimeerrorModule = null
const RuntimeErrorFactory = () => {
  if (!runtimeerrorModule) {
    runtimeerrorModule = create()
  }

  return runtimeerrorModule
}


module.exports = {
  RuntimeErrorFactory,
}
