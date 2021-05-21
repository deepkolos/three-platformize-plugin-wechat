const { THREE, WechatPlatform, GLTFLoader, OrbitControls } =
  requirePlugin('three-platformize');

Page({
  disposing: false,
  platform: null,
  frameId: -1,

  onReady() {
    wx.createSelectorQuery().select('#gl').node().exec((res) => {
      const canvas = res[0].node

      this.platform = new WechatPlatform(canvas)
      THREE.PLATFORM.set(this.platform);

      const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true, alpha: true })
      const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
      const scene = new THREE.Scene()
      const gltfLoader = new GLTFLoader()
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true

      wx.showLoading({ title: '加载模型中' })
      gltfLoader.loadAsync('https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb').then((gltf) => {
        // @ts-ignore
        gltf.parser = null;
        gltf.scene.position.y = -2;
        scene.add(gltf.scene);
        wx.hideLoading()
      })

      // scene.background = new THREE.Color(0x123456)
      camera.position.z = 10
      renderer.outputEncoding = THREE.sRGBEncoding
      scene.add(new THREE.AmbientLight(0xffffff, 1.0))
      scene.add(new THREE.DirectionalLight(0xffffff, 1.0))
      renderer.setSize(canvas.width, canvas.height)
      renderer.setPixelRatio(THREE.$window.devicePixelRatio)

      const render = () => {
        if (!this.disposing) this.frameId = THREE.$requestAnimationFrame(render)
        controls.update()
        renderer.render(scene, camera);
      }
      render()
    })
  },

  onUnload() {
    this.disposing = true
    $cancelAnimationFrame(this.frameId)
    PLATFORM.dispose()
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e)
  },
});
