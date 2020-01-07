// require('!style-loader!css-loader!../fonts/fonts.css')
// require('!style-loader!css-loader!./loading-module.css')

// const html = require('./loading-module.html')
const html = `
<div id="loadingContainer" class="absolute-fill">
  <!--Loading screen-->
  <div id="loadBackground" class="absolute-fill">
    <div id="loadImageContainer" class="absolute-fill">
      <img src="//cdn.8thwall.com/web/img/loading/v1/eight.png" id="loadImage" class="rotate-center" />
    </div>
  </div>

  <!--Camera Permissions-->
  <div id="requestingCameraPermissions" class="hidden" />
    <img id="requestingCameraIcon" src="//cdn.8thwall.com/web/img/loading/v1/camera-purple.png" />
    Tap "Allow" so we can<br>augment your reality.
  </div>

  <!--Permission error, iOS-->
  <div id="cameraPermissionsErrorApple" class="absolute-fill hidden" />
    Refresh the page to enable<br>your camera for AR
    <img id="cameraPermissionsErrorAppleArrow" src="//cdn.8thwall.com/web/img/loading/v1/arrow.png" />
    <img id="cameraPermissionsErrorAppleReloadCamera" src="//cdn.8thwall.com/web/img/loading/v1/reload-camera.png" />
  </div>

  <!--Permission error, Android-->
  <div id="cameraPermissionsErrorAndroid" class="absolute-fill hidden">
    <div id="cameraPermissionsCameraIcon">
      <img src="//cdn.8thwall.com/web/img/loading/v1/camera-purple.png" />
    </div>
    <div class="loading-error-header">Let's enable your camera</div>
    <ol class="loading-error-instructions">
      <li>Tap the <img src="//cdn.8thwall.com/web/img/loading/v1/ellipsis.png"> in the top right</li>
      <li>Tap <span class="highlight">Settings</li>
      <li class="chrome-instruction hidden">
        <span class="highlight">Site settings</span>
      </li>
      <li class="chrome-instruction hidden">
        <span class="highlight">Camera</span>
      </li>
      <li class="chrome-instruction hidden">
        <span class="highlight">Blocked</span>
        <br>
        <span class="camera-instruction-block domain-view">apps.8thwall.com</span>
      </li>
      <li class="chrome-instruction hidden">
        <span class="camera-instruction-button">CLEAR & RESET</span>
      </li>
      <li class="samsung-instruction hidden">
        <span class="highlight">Advanced</span>
      </li>
      <li class="samsung-instruction hidden">
        <span class="highlight">Manage website data</span>
      </li>
      <li class="samsung-instruction hidden">
        Press and hold<br>
        <span class="camera-instruction-block domain-view">apps.8thwall.com</span>
      </li>
      <li class="samsung-instruction hidden">
        <span class="highlight" style="color: #1500ba">DELETE</span>
      </li>
    </ol>
    <div class="loading-error-footer">
      <img src="//cdn.8thwall.com/web/img/loading/v1/reload.png" />
      Then, reload the page to experience some AR magic!
    </div>
  </div>

    <!--iOS devicemotion sensor is disabled -->
  <div id="deviceMotionErrorApple" class="absolute-fill hidden">
    <div class="loading-error-header">Let's enable your motion sensors</div>
    <ol class="loading-error-instructions">
      <li>Open <img src="https://cdn.8thwall.com/web/img/loading/v1/settings-icon-ios.png" style="max-height: 4vh"><b>Settings</b></li>
      <li>Select <img src="https://cdn.8thwall.com/web/img/loading/v1/safari-icon.png" style="max-height: 4vh"><b>Safari</b></li>
      <li>Enable <span class="highlight">Motion&nbsp;&amp;&nbsp;Orientation Access</span></li>
      <li>Reload the page <img src="//cdn.8thwall.com/web/img/loading/v1/reload.png"></li>
    </ol>
    <!-- Empty footer to take up space -->
    <div class="loading-error-footer"></div>
  </div>

  <div id="userPromptError" class="permission-error absolute-fill hidden">
    <h1>Permissions were denied.</h1>
    <p>You need to accept permissions to continue.</p>
    <button id="reloadButton" class="main-button" onClick="window.location.reload()">Refresh</button>
  </div>

  <div id="motionPermissionsErrorApple" class="permission-error absolute-fill hidden">
    <h1>Permissions were denied.</h1>
    <p>You've prevented the page from accessing your motion sensors.</p>
    <p>Please close out of Safari to reenable your motion sensors.</p>
  </div>

  <div id="cameraSelectionWorldTrackingError" class="permission-error absolute-fill hidden">
    <p><img height="75px" src="//cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png" class="floater"></p>
    <div class="error-text-header">Oops, something went wrong!</div>
    <p id="camera_mode_world_tracking_error"></p>
  </div>
</div>
`

const { XR8 } = window

let loadingModule = null

const LoadingFactory = () => {
  if (!loadingModule) {
    loadingModule = create()
  }

  return loadingModule
}

function create() {
  let rootNode_ = null
  let loadBackground_
  let loadImageContainer_
  let camPermissionsRequest_
  let camPermissionsFailedAndroid_
  let camPermissionsFailedApple_
  let camPermissionsFailedSamsung_
  let deviceMotionErrorApple_
  let appLoaded_ = () => true
  let numUpdates_ = 0
  let waitingOnReality_ = false
  let needsPermissionCookie_ = false
  let cameraSelectionWorldTrackingError_
  let motionPermissionsErrorApple_
  let userPromptError_


  const ua = navigator.userAgent

  let hasMotionEvents_ = !!window.isFakeDevice()
  const motionListener = () => {
    hasMotionEvents_ = true
    window.removeEventListener('devicemotion', motionListener)
  }
  window.addEventListener('devicemotion', motionListener)

  const iframeMotionListener = (event) => {
    if (event.data.deviceOrientation8w || event.data.deviceMotion8w) {
      hasMotionEvents_ = true
      window.removeEventListener('message', iframeMotionListener)
    }
  }
  window.addEventListener('message', iframeMotionListener)

  const setRoot = (rootNode) => {
    rootNode_ = rootNode
    loadBackground_ = rootNode_.querySelector('#loadBackground')
    loadImageContainer_ = rootNode_.querySelector('#loadImageContainer')
    camPermissionsRequest_ = document.getElementById('requestingCameraPermissions')
    camPermissionsFailedAndroid_ = document.getElementById('cameraPermissionsErrorAndroid')
    camPermissionsFailedApple_ = document.getElementById('cameraPermissionsErrorApple')
    camPermissionsFailedSamsung_ = document.getElementById('cameraPermissionsErrorSamsung')
    deviceMotionErrorApple_ = document.getElementById('deviceMotionErrorApple')
    userPromptError_ = document.getElementById('userPromptError')
    cameraSelectionWorldTrackingError_ = document.getElementById('cameraSelectionWorldTrackingError')
    motionPermissionsErrorApple_ = document.getElementById('motionPermissionsErrorApple')
  }

  const hideLoadingScreenNow = (removeRoot = true) => {
    loadBackground_.classList.add('hidden')
    removeRoot && rootNode_.parentNode && rootNode_.parentNode.removeChild(rootNode_)
  }

  const hideLoadingScreen = (removeRoot = true) => {
    loadImageContainer_.classList.add('fade-out')
    setTimeout(() => {
      loadBackground_.classList.add('fade-out')
      loadBackground_.style.pointerEvents = 'none'
      setTimeout(() => hideLoadingScreenNow(removeRoot), 400)
    }, 400)
  }

  const showCameraPermissionsPrompt = () => {
    camPermissionsRequest_.classList.remove('hidden')
  }

  const dismissCameraPermissionsPrompt = () => {
    camPermissionsRequest_.classList.add('fade-out')
  }

  const promptUserToChangeBrowserSettings = () => {
    camPermissionsRequest_.classList.add('hidden')
    if (ua.includes('Linux')) {
      let instructionsToShow

      const domainViews = rootNode_.querySelectorAll('.domain-view')
      for (let i = 0; i < domainViews.length; i++) {
        domainViews[i].textContent = window.location.hostname
      }

      if (navigator.userAgent.includes('SamsungBrowser')) {
        instructionsToShow = rootNode_.querySelectorAll('.samsung-instruction')
      } else {
        instructionsToShow = rootNode_.querySelectorAll('.chrome-instruction')
      }
      camPermissionsFailedAndroid_.classList.remove('hidden')
      for (let i = 0; i < instructionsToShow.length; i++) {
        instructionsToShow[i].classList.remove('hidden')
      }
    } else {
      camPermissionsFailedApple_.classList.remove('hidden')
    }
    hideLoadingScreen(false)

    XR8.pause()
    XR8.stop()
  }

  const promptUserToChangeBrowserMotionSettings = () => {
    window.removeEventListener('devicemotion', motionListener)
    window.removeEventListener('message', iframeMotionListener)

    // Device orientation permissions only need to be requested on iOS.
    if (XR8.XrDevice.deviceEstimate().os !== 'iOS') {
      return
    }

    // Device orientation permissions only need to be requested if they're required.
    if (XR8.XrPermissions) {
      const permissions = XR8.XrPermissions.permissions()
      const requiredPermissions = XR8.requiredPermissions()
      if (!requiredPermissions.has(permissions.DEVICE_MOTION)
        && !requiredPermissions.has(permissions.DEVICE_ORIENTATION)) {
        return
      }
    }

    if (XR8.XrDevice.deviceEstimate().osVersion.startsWith('12')) {
      deviceMotionErrorApple_.classList.remove('hidden')
    } else {
      motionPermissionsErrorApple_.classList.remove('hidden')
    }

    hideLoadingScreen(false)
    XR8.pause()
    XR8.stop()
  }

  const checkLoaded = () => {
    if (appLoaded_() && !waitingOnReality_) {
      if (needsPermissionCookie_) {
        document.cookie = 'previouslyGotCameraPermission=true;max-age=31536000'
      }
      hideLoadingScreen()
      return
    }
    requestAnimationFrame(() => { checkLoaded() })
  }
  const isAndroid = ua.includes('Linux')
  needsPermissionCookie_ = isAndroid && !document.cookie.includes('previouslyGotCameraPermission=true')
  const previouslyGotCameraPermission = isAndroid && !needsPermissionCookie_
  const pipelineModule = () => ({
    name: 'loading',
    onStart: () => {
      if (hasMotionEvents_ !== true) {
        promptUserToChangeBrowserMotionSettings()
      }
    },
    onUpdate: () => {
      if (!waitingOnReality_) {
        return
      }
      if (numUpdates_ < 5) {
        ++numUpdates_
      } else {
        waitingOnReality_ = false
        checkLoaded()
      }
    },
    onBeforeRun: () => {
      showLoading()
    },
    onCameraStatusChange: ({ status }) => {
      if (!XR8.XrDevice.isDeviceBrowserCompatible()) {
        return
      }
      if (status === 'requesting') {
        showLoading()
        if (!previouslyGotCameraPermission) {
          showCameraPermissionsPrompt()
        }
      } else if (status === 'hasStream') {
        if (!previouslyGotCameraPermission) {
          dismissCameraPermissionsPrompt()
        }
      } else if (status === 'hasVideo') {
        // wait a few frames for UI to update before dropping load screen.
      } else if (status === 'failed') {
        promptUserToChangeBrowserSettings()
      }
    },
    onException: (error) => {
      if (!rootNode_) {
        return
      }

      if (error instanceof Object) {
        if (error.type === 'permission') {
          if (error.permission === 'prompt') {
            // User denied XR8's prompt to start requesting
            hideLoadingScreen(false)
            userPromptError_.classList.remove('hidden')
            return
          }

          if (error.permission === XR8.XrPermissions.permissions().DEVICE_MOTION
            || error.permission === XR8.XrPermissions.permissions().DEVICE_ORIENTATION) {
            // This only happens if motion or orientation are requestable permissions (iOS 13+)
            promptUserToChangeBrowserMotionSettings()
            return
          }
        }
        if (error.type === 'configuration') {
          if (error.source === 'reality' && error.err === 'slam-front-camera-unsupported') {
            // User is attemping to use Front camera without disabling world tracking
            hideLoadingScreen(false)
            document.getElementById('camera_mode_world_tracking_error').innerHTML = error.message
            cameraSelectionWorldTrackingError_.classList.remove('hidden')

            // Stop camera processing.
            XR8.pause()
            XR8.stop()
            return
          }
        }
      }

      dismissCameraPermissionsPrompt()
      hideLoadingScreenNow()
    },
  })

  const showLoading = (args) => {
    if (rootNode_) {
      return
    }

    // Show the loading UI.
    const e = document.createElement('template')
    e.innerHTML = html.trim()
    const rootNode = e.content.firstChild
    document.getElementsByTagName('body')[0].appendChild(rootNode)
    setRoot(rootNode)
    waitingOnReality_ = true

    if (args && args.onxrloaded) {
      window.XR8 ? args.onxrloaded() : window.addEventListener('xrloaded', args.onxrloaded)
    }
  }

  const setAppLoadedProvider = (appLoaded) => {
    appLoaded_ = appLoaded
  }

  return {
    pipelineModule,
    showLoading,
    setAppLoadedProvider,
  }
}

module.exports = {
  LoadingFactory,
}
