// ページの読み込みを待つ
window.addEventListener("load", init);

function init() {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xa1e2c9, 1.0);
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  // DOMにrenderを追加する
  document.body.appendChild(renderer.domElement);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // カメラの初期座標を設定
  camera.position.set(10, 10, 10);

  // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  //なめらかにカメラ制御
  controls.userPan = false;
  controls.userPanSpeed = 0.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.3;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  //gridの追加
  //   const grid = new THREE.GridHelper(50, 50, 0xedeade, 0xb2a89f);
  //   grid.position.set(0, -3, 0);
  //   scene.add(grid);

  // Load GLB
  const GLBloader = new THREE.GLTFLoader();
  const url = "https://chiisann.github.io/Car/Road.glb";

  let model = null;
  GLBloader.load(url, function (gltf) {
    model = gltf.scene;
    model.scale.set(1.0, 1.0, 1.0);
    model.position.set(0, 1, 0);
    let mesh = model.children[0];
    console.log(model.children[0]);
    mesh.castShadow = true;
    scene.add(model);
  });
  renderer.gammaOutput = true; //マテリアルの調整
  renderer.gammaFactor = 2.2;

  //ライト
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // スポットライト光源を作成
  const Spotlight = new THREE.SpotLight(0xff596a, 2, 20, Math.PI / 6, 0, 0.5);
  Spotlight.position.set(10, 10, 10);
  Spotlight.castShadow = true;
  scene.add(Spotlight);

  tick();

  //   Cylinders();
  //   function Cylinders() {
  //     var colors = [0xff596a, 0x99c5c0, 0xfcd999];
  //     var geometry = new THREE.SphereGeometry(0.2, 0.2, 0.5, 32);
  //     for (var i = 0; i < 50; i++) {
  //       var material = new THREE.MeshBasicMaterial({
  //         color: Number(colors[Math.floor(Math.random() * 3)]),
  //       });
  //       var mesh = new THREE.Mesh(geometry, material);
  //       mesh.position.set(
  //         30 * (Math.random() - 0.5),
  //         30 * (Math.random() - 0.1),
  //         30 * (Math.random() - 0.5)
  //       );
  //       scene.add(mesh);
  //     }
  //   }

  // GASP animation
  gsap.to("#text", {
    duration: 5,
    delay: 1.5,
    scrambleText: {
      text: "Welcome to chiisann's Portfolio",
      rightToLeft: true,
      chars: "lowercase",
    },
  });

  gsap.registerPlugin(SplitText);

  console.clear();

  document.fonts.ready.then(() => {
    gsap.set(".split", { opacity: 1 });

    let split;
    SplitText.create(".split", {
      type: "words,lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        split = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "expo.out",
        });
        return split;
      },
    });
  });

  // 毎フレーム時に実行されるループイベント
  function tick() {
    onResize();
    //リサイズイベント発生時
    window.addEventListener("resize", onResize);

    function onResize() {
      // サイズを取得
      const width = window.innerWidth;
      const height = window.innerHeight;

      // レンダラーのサイズを調整する
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // カメラのアスペクト比を正す
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    //カメラコントローラーを更新
    controls.update();

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
