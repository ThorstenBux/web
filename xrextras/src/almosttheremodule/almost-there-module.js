// require('!style-loader!css-loader!../fonts/fonts.css')
// require('!style-loader!css-loader!./almost-there-module.css')

// const html = require('./almost-there-module.html')
const html = `<div id="almostthereContainer" class="absolute-fill">
<!--Not on mobile -->
<div id="error_msg_device" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-20">
      <div id="qrcode"></div>
      <br/>
      <div class="error-text-header">
        <span style="font-size:24pt;line-height:20pt;">
          Hey! Looks like you're on a desktop.
        </span>
      </div>
      <div class="error-text-hint">
        <span style="font-size:15pt;line-height:50pt;letter-spacing:-.21;color:#323232">
          For the augmented reality experience, scan this code
        </span>
      </div>
      <div class="error-text-hint">
        <span style="font-size:15pt;line-height:20pt;letter-spacing:-.21;color:#323232">
          or visit <span class="desktop-home-link"></span>
          on a smartphone or tablet.
        </span>
      </div>
    </div>
  </div>
</div>

<!--iOS webview, reachable from button press -->
<div id="error_msg_open_in_safari" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-5">
      <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/safari-icon.png"></p>
      <div class="error-text-header">You're almost there!</div>
      <div class="error-text-detail">
        To view this experience, please open in Safari.
      </div>
      <br/>
      <img id="apple_open_safari_hint"
        src="//cdn.8thwall.com/web/img/almostthere/v1/open-in-safari.png"
        class="apple-safari-hint hidden"/>
      <img id="apple_tap_to_open_safari_hint"
        src="//cdn.8thwall.com/web/img/almostthere/v1/tap-to-open-in-safari.png"
        class="apple-safari-hint hidden"/>
      <img id="apple_tap_top_right_to_open_safari_hint"
        src="//cdn.8thwall.com/web/img/loading/v1/arrow.png"
        class="apple-top-safari-hint hidden"/>
      <img id="apple_tap_to_open_safari_hint_snap"
        src="//cdn.8thwall.com/web/img/almostthere/v1/tap-to-open-in-safari.png"
        class="apple-safari-hint-snap hidden"/>
    </div>
  </div>
</div>

<!--iOS webview, requires copy/paste of link -->
<div id="error_msg_apple_almost_there" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-5">
      <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/safari-icon.png"></p>
      <div class="error-text-header">You're almost there!</div>
      <div class="error-text-detail">
        To view this experience, please open in Safari.
      </div>
      <br/>
      <p><span class="desktop-home-link"></span></p>
      <div id="apple_copy_hint" class="error-text-hint">
        Open your Safari browser and paste.
      </div>
    </div>
  </div>
</div>

<!--Missing Web Assembly, or iOS 11.2 (which has a WebAssembly regression)-->
<div id="error_msg_web_assembly_ios" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-5">
      <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/safari-icon.png"></p>
      <div class="error-text-header">You're almost there!</div>
      <div class="error-text-detail">
        To view this experience, please update to a newer version of iOS.
      </div>
    </div>
  </div>
</div>
<div id="error_msg_web_assembly_android" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-5">
      <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/google-chrome.png"></p>
      <div class="error-text-header">You're almost there!</div>
      <div class="error-text-detail">
        Browser doesn't support WebAssembly. Please update your browser.
      </div>
    </div>
  </div>
</div>

<!--Android unsupported browser -->
<div id="error_msg_android_almost_there" class="hidden">
  <div class="error-text-outer-container">
    <div class="error-text-container error-margin-top-5">
      <p><img height="100px" src="//cdn.8thwall.com/web/img/almostthere/v1/google-chrome.png"></p>
      <div class="error-text-header">You're almost there!</div>
      <div class="error-text-detail">
        To view this experience on your Android device, please open in Google Chrome or your
        native browser.
      </div>
      <br/>
      <p><span class="desktop-home-link"></span></p>
      <div id="android_copy_hint" class="error-text-hint">Open your browser and paste.</div>
    </div>
  </div>
</div>
</div>
`

function create() {
  let shown = false
  let customRedirectUrl
  const showId = (id) => {
    document.getElementById(id).classList.remove('hidden')
  }

  const showAlmostThere = () => {
    const { XR8 } = window
    const e = document.createElement('template')
    e.innerHTML = html.trim()
    const rootNode = e.content.firstChild
    document.getElementsByTagName('body')[0].appendChild(rootNode)

    const redirectUrl = customRedirectUrl || window.location.href
    const redirectLinks = rootNode.querySelectorAll('.desktop-home-link')
    for (let i = 0; i < redirectLinks.length; i++) {
      redirectLinks[i].textContent = redirectUrl
    }

    const reasons = XR8.XrDevice.incompatibleReasons()
    const details = XR8.XrDevice.incompatibleReasonDetails()
    const device = XR8.XrDevice.deviceEstimate()

    if (reasons.includes(XR8.XrDevice.IncompatibilityReasons.UNSUPPORTED_BROWSER)) {
      if (device.os === 'iOS') {
        if (details.inAppBrowserType === 'Safari') {
          showId('error_msg_open_in_safari')
          showId('apple_open_safari_hint')
        } else if (details.inAppBrowserType === 'Ellipsis') {
          showId('error_msg_open_in_safari')
          showId('apple_tap_to_open_safari_hint')
        } else if (details.inAppBrowser === 'Instagram') {
          showId('error_msg_open_in_safari')
          showId('apple_tap_top_right_to_open_safari_hint')
        } else if (details.inAppBrowser === 'Snapchat') {
          showId('error_msg_open_in_safari')
          showId('apple_tap_to_open_safari_hint_snap')
        } else {
          showId('error_msg_apple_almost_there')
        }
        return
      }
    }

    if (reasons.includes(XR8.XrDevice.IncompatibilityReasons.MISSING_WEB_ASSEMBLY)) {
      if (device.os === 'iOS') {
        showId('error_msg_web_assembly_ios')
        return
      }
      if (device.os === 'Android') {
        showId('error_msg_web_assembly_android')
        return
      }
    }

    if (device.os === 'iOS') {
      showId('error_msg_apple_almost_there')
      return
    }

    if (device.os === 'Android') {
      showId('error_msg_android_almost_there')
      return
    }

    // Desktop: help our user with a qr code
    showId('error_msg_device')
    const scriptElem = document.createElement('script')
    scriptElem.type = 'text/javascript'
    scriptElem.src = 'https://cdn.8thwall.com/web/share/qrcode8.js'
    scriptElem.onload = () => {
      document.getElementById('qrcode').innerHTML = window.generateQRHtml(redirectUrl)
    }
    document.getElementById('almostthereContainer').appendChild(scriptElem)
  }

  const checkCompatibility = () => {
    const { XR8 } = window
    if (shown) {
      return false
    }

    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // Everything is ok.
      return true
    }

    showAlmostThere()
    shown = true

    XR8.pause()
    XR8.stop()
    return false
  }

  const pipelineModule = () => ({
    name                 : 'almostthere',
    onCameraStatusChange : () => {
      if (!checkCompatibility()) {
        // Throwing an error here allows other pipeline modules to react in their onException
        // methods.
        throw Error('Device or browser incompatible with XR.')
      }
    },
    onException: () => {
      checkCompatibility()
    },
  })

  const configure = ({ url }) => {
    if (url !== undefined) {
      customRedirectUrl = url
    }
  }

  return {
    pipelineModule,
    checkCompatibility,
    configure,
  }
}

let almostThereModule = null
const AlmostThereFactory = () => {
  if (!almostThereModule) {
    almostThereModule = create()
  }
  return almostThereModule
}

module.exports = {
  AlmostThereFactory,
}
