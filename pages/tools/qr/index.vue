<script setup lang="ts">
import { fileupload } from "~/api/apis/common/fileupload";
import { userFileupload } from "~/api/apis/common/userFileupload";
import { getQr } from "~/api/apis/tool/getQr";
import type { Breadcrumb } from "~/api/models/common";

useHead({
  title: "QRコード作成ツール",
});

useSeoMeta({
  description: `ロゴ画像や画像の色、ドットの種類をカスタマイズしながらQRコードを作成できるオンラインツールです。`,
});

const breadcrumb: Breadcrumb[] = [];
breadcrumb.push({
  label: "Home",
  link: "/",
});
breadcrumb.push({
  label: "tools",
  link: "/tools/",
});
breadcrumb.push({
  label: "QRコード作成ツール",
  link: "",
});

const DOT_TYPE_SQUARE = 1;
const DOT_TYPE_CIRCLE = 2;

const EXTENSION_JPG = 1;
const EXTENSION_PNG = 2;

const initialParam = {
  qr_content: "",
  logo_image_path: "",
  halftone_image_path: "",
  filename: "ファイルがアップロードされていません。",
  bg_transparent: false,
  bg_color: "#ffffff",
  fg_color: ["#000000"],
  dot_type: DOT_TYPE_SQUARE,
  image_extension: EXTENSION_JPG,
};

const openCustomize = ref(false);

const qrContent = ref("");
const logoImagePath = ref("");
const logoUploadFilename = ref(initialParam.filename);
const halftoneImagePath = ref("");
const halftoneUploadFilename = ref(initialParam.filename);
const fgColor = ref(["#000000"]);
const bgColor = ref("#ffffff");
const bgTransparent = ref(false);
const dotType = ref(DOT_TYPE_SQUARE);
const imageExtension = ref(EXTENSION_JPG);
const qrUrl = ref("")

// const hasError = ref(false)
// const errorMessage = ref('')

const onChangeLogoImage = async (event: Event) => {
  logoImagePath.value = await fileupload(event, logoUploadFilename);
};

const onChangeHalftoneImage = async (event: Event) => {
  halftoneImagePath.value = await fileupload(event, halftoneUploadFilename);
};

const fileupload = async (event: Event, ref: globalThis.Ref<string, string>) => {
  let filename = "";

  if (!event) {
    return filename;
  }

  if (!event.target) {
    return filename;
  }
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    const formData = new FormData();
    formData.append("file", files[0]);
    ref.value = files[0].name;

    try {
      // loading.load()
      const res = await userFileupload(formData);
      filename = res.filename;
    } catch (error) {
      console.log(error);
    } finally {
      // loading.unload()
    }
  }
  return filename;
};

const onClickSubmit = async (event: Event) => {
  event.preventDefault();

  let url = "";

  try {
    const res = await getQr({
      content: qrContent.value,
      logo_image_path: logoImagePath.value,
      halftone_image_path: halftoneImagePath.value,
      fg_color: fgColor.value,
      bg_color: bgColor.value,
      bg_transparent: bgTransparent.value,
      dot_type: dotType.value,
      image_extension: imageExtension.value,
    });

    url = res.url;
  } catch (error) {
    console.log(error);
  } finally {
    // loading.unload()
  }

  qrUrl.value = url
  const link = document.createElement("a");
  link.download = url;
  link.click();
};

const onClickReset = () => {
  qrContent.value = initialParam.qr_content;
  fgColor.value = initialParam.fg_color;
  bgColor.value = initialParam.bg_color;
  bgTransparent.value = initialParam.bg_transparent;
  dotType.value = initialParam.dot_type;
  imageExtension.value = initialParam.image_extension;
  logoImagePath.value = initialParam.logo_image_path;
  halftoneImagePath.value = initialParam.halftone_image_path;
  logoUploadFilename.value = initialParam.filename;
  halftoneUploadFilename.value = initialParam.filename;
  qrUrl.value = ""
};

const onClickDownload = () => {
  // const filename = 'passwords.csv'
  // const data = passwords.value.join('\n')
  // const bom = new Uint8Array([0xef, 0xbb, 0xbf])
  // const blob = new Blob([bom, data], { type: 'text/csv' })
  // const link = document.createElement('a')
  // link.download = filename
  // link.href = URL.createObjectURL(blob)
  // link.click()
  // URL.revokeObjectURL(link.href)
};
</script>

<template>
  <main class="max-w-5xl mx-auto p-4">
    <AtomBreadcrumb :breadcrumb="breadcrumb" />
    <div class="max-w-5xl mx-auto mt-4 sm:mt-10">
      <header class="flex items-center justify-center mb-4 sm:mb-8">
        <i class="material-icons mr-2 text-4xl">qr_code_2</i>
        <h1 class="text-3xl font-bold text-center">QRコード作成ツール</h1>
      </header>
      <section class="mt-4">
        <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">作成条件を設定する</h2>
        <form class="flex flex-col">
          <dl class="flex flex-col sm:flex-row items-stretch py-1">
            <dt
              class="w-full sm:w-36 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
            >
              <label for="qr-content"> 内容 </label>
            </dt>
            <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
              <textarea
                id="qr-content"
                v-model="qrContent"
                name="qr-content"
                placeholder="ここに入力した内容がQRコードリーダーで読み取られます。"
                type="text"
                class="w-full rounded"
              />
            </dd>
          </dl>

          <dl class="flex flex-col sm:flex-row items-stretch py-1">
            <dt
              class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
            >
              <p>中心画像</p>
            </dt>
            <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 flex items-center">
              <div class="flex">
                <label
                  for="logo-image"
                  class="flex border border-gray-400 rounded hover:opacity-60 hover:cursor-pointer"
                >
                  <p class="bg-gray-800 text-white text-center py-2 px-4 rounded-l">
                    ファイルを選択
                  </p>
                  <p class="py-2 px-4 bg-white rounded-r">
                    {{ logoUploadFilename }}
                  </p>
                </label>
                <input
                  id="logo-image"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onChangeLogoImage"
                />
              </div>
            </dd>
          </dl>

          <dl class="flex flex-col sm:flex-row items-stretch py-1">
            <dt
              class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
            >
              ハーフトーン画像
            </dt>
            <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 flex items-center">
              <div class="flex">
                <label
                  for="halftone-image"
                  class="flex border border-gray-400 rounded hover:opacity-60 hover:cursor-pointer"
                >
                  <p class="bg-gray-800 text-white text-center py-2 px-4 rounded-l">
                    ファイルを選択
                  </p>
                  <p class="py-2 px-4 bg-white rounded-r">
                    {{ halftoneUploadFilename }}
                  </p>
                </label>
                <input
                  id="halftone-image"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onChangeHalftoneImage"
                />
              </div>
            </dd>
          </dl>

          <div>
            <button
              type="button"
              class="flex items-center justify-center w-full border-2 py-2 border-gray-800 rounded"
              @click="openCustomize = !openCustomize"
            >
              カスタム設定
              <i class="material-icons ml-2 text-2xl"> keyboard_arrow_down </i>
            </button>

            <div :class="openCustomize ? 'block' : 'hidden'">
              <div class="grid grid-cols-2 gap-1">
                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                  <dt
                    class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                  >
                    <label for="background-color"> 画像サイズ </label>
                  </dt>
                  <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                    <input type="number" />
                  </dd>
                </dl>

                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                  <dt
                    class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                  >
                    <label for="background-color"> 余白の大きさ </label>
                  </dt>
                  <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                    <input type="number" />
                  </dd>
                </dl>

                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                  <dt
                    class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                  >
                    <label for="background-color"> 背景色 </label>
                  </dt>
                  <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                    <div class="flex items-center">
                      <input
                        id="background-color"
                        v-model="bgColor"
                        class="disabled:opacity-60"
                        type="color"
                        :disabled="bgTransparent"
                        title="背景色のカラーピッカー"
                      />
                      <input
                        id="text-background-color"
                        v-model="bgColor"
                        title="背景色のカラーコード"
                        type="text"
                        class="ml-4 w-24 disabled:opacity-60"
                        :disabled="bgTransparent"
                      />
                    </div>
                    <fieldset class="p-2 flex items-center">
                      <legend class="hidden">背景を透過する</legend>
                      <input
                        id="bg-transparent"
                        v-model="bgTransparent"
                        name="bg-transparent"
                        type="checkbox"
                      />
                      <label for="bg-transparent" class="pl-2"> 透明にする </label>
                    </fieldset>
                  </dd>
                </dl>

                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                  <dt
                    class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                  >
                    <label for="foreground-color"> QRの色 </label>
                  </dt>
                  <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                    <ul>
                      <li
                        v-for="(_fgColor, index) in fgColor"
                        :key="index"
                        class="flex items-center"
                        :class="index > 0 ? 'mt-2' : ''"
                      >
                        <input
                          id="foreground-color"
                          v-model="fgColor[index]"
                          type="color"
                          title="QRドット色のカラーピッカー"
                        />
                        <input
                          id="text-foreground-color"
                          v-model="fgColor[index]"
                          title="QRドット色のカラーコード"
                          type="text"
                          class="ml-4 w-24"
                        />
                        <button
                          v-if="index > 0"
                          type="button"
                          class="rounded-full bg-gray-800 text-white flex items-center justify-center p-1 ml-2 hover:opacity-60"
                          @click="fgColor.splice(index, 1)"
                        >
                          <i class="material-icons text-xl"> close </i>
                        </button>
                      </li>
                    </ul>
                    <div class="p-2 flex items-center">
                      <button
                        type="button"
                        class="flex items-center rounded border border-gray-800 bg-white px-4 py-2"
                        @click="fgColor.push('#000000')"
                      >
                        <i class="material-icons mr-2 text-xl"> add </i>
                        色を追加する
                      </button>
                    </div>
                    <p class="p-2">※複数設定するとグラデーションにできます。</p>
                  </dd>
                </dl>

                <div class="flex flex-col sm:flex-row items-stretch py-1">
                  <fieldset class="contents">
                    <legend
                      class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                      ドットの形
                    </legend>
                    <div class="p-2 sm:pl-4 flex-grow bg-gray-50">
                      <div>
                        <input
                          id="dot-square"
                          v-model="dotType"
                          name="dot-type"
                          type="radio"
                          :value="DOT_TYPE_SQUARE"
                        />
                        <label for="dot-square" class="pl-2"> 四角形 </label>
                      </div>
                      <div>
                        <input
                          id="dot-circle"
                          v-model="dotType"
                          name="dot-type"
                          type="radio"
                          :value="DOT_TYPE_CIRCLE"
                        />
                        <label for="dot-circle" class="pl-2"> 丸 </label>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div class="flex flex-col sm:flex-row items-stretch py-1">
                  <fieldset class="contents">
                    <legend
                      class="w-full sm:w-36 py-2 px-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                      <label for="background-color"> 画像フォーマット </label>
                    </legend>
                    <div class="p-2 sm:pl-4 flex-grow bg-gray-50">
                      <div>
                        <input
                          id="extension-jpg"
                          v-model="imageExtension"
                          name="extension-type"
                          type="radio"
                          :value="EXTENSION_JPG"
                        />
                        <label for="extension-jpg" class="pl-2"> jpg </label>
                      </div>
                      <div>
                        <input
                          id="extension-png"
                          v-model="imageExtension"
                          name="extension-type"
                          type="radio"
                          :value="EXTENSION_PNG"
                        />
                        <label for="extension-png" class="pl-2"> png </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              class="flex items-center justify-center rounded py-4 px-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
              @click="onClickSubmit"
            >
              <i class="material-icons mr-2 text-2xl"> add </i>
              QRコード作成
            </button>

            <button
              type="button"
              class="flex items-center justify-center rounded p-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
              @click="onClickDownload"
            >
              <i class="material-icons mr-2 text-2xl"> download </i>
              QRコードダウンロード
            </button>

            <button
              type="button"
              class="flex items-center justify-center rounded p-4 w-full text-bold bg-red-800 text-white hover:opacity-80"
              @click="onClickReset"
            >
              <i class="material-icons mr-2 text-2xl"> undo </i>
              条件リセット
            </button>
          </div>
        </form>
        <div class="flex items-center justify-center">
            <img :src="qrUrl" alt="QRコード" title="QRコード" />
        </div>
      </section>

      <section class="mt-8 mb-20">
        <h2 class="text-xl font-bold border-b-2 border-gray-800 p-2 mb-2">使い方</h2>
        <p style="text-indent: 1rem">
          条件に従ってQRコードを作成するツールです。<br />
          条件を複雑にすると読み取り精度が下がることがあります。作成後は実際に読み取れることを確認の上使用してください。<br />
          現在以下の機能があります。いい機能を思いついたら今後も追加予定です。<br />
          不具合報告、機能ネタをご提供いただける場合は<NuxtLink
            class="underline hover:opacity-50"
            href="/opinion"
            >問合せフォーム</NuxtLink
          >からお願いします。
        </p>

        <h3 class="text-lg font-bold border-l-2 border-gray-800 px-4 mb-2 mt-4">
          基本機能
        </h3>
        <ul class="ml-6 list-disc">
          <li>
            <strong>内容</strong
            >を入力すると、その文字列を読み取れるQRコードを作成します。(必須入力項目です。)
          </li>
          <li><strong>中心画像</strong>を設定すると、中心にその画像を表示します。</li>
          <li>
            <strong>ハーフトーン画像</strong
            >を設定すると、設定した画像をQRドットで(ハーフトーンで)表現します。
          </li>
        </ul>

        <h3 class="text-lg font-bold border-l-2 border-gray-800 px-4 mb-2 mt-4">
          カスタム設定
        </h3>
        <ul class="ml-6 list-disc">
          <li>
            <strong>サイズ</strong
            >を設定すると、画像サイズを変更できます。(デフォルト幅500×高さ500)
          </li>
          <li><strong>余白の大きさ</strong>を設定すると、画像の余白を変更できます。</li>
          <li>
            <strong>背景色</strong
            >を設定すると、背景色を付けることが出来ます。(デフォルト白背景)<br />
            <strong>「透明にする」</strong>をチェックすると透過することも可能です。<br />
            ※透明にする場合、強制的にPNG形式で出力されます。
          </li>
          <li>
            <strong>QRの色</strong
            >を設定すると、ドット部分に色を付けることが出来ます。(デフォルト黒)<br />
            複数の色を追加することでグラデーションを設定することもできます。
          </li>
          <li>
            <strong>ドットの形</strong
            >を設定すると、QRのドット部分を丸くすることが出来ます。
          </li>
          <li>
            <strong>画像フォーマット</strong
            >を設定すると、ダウンロードする画像のフォーマットを設定できます。（PNG, JPG）
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>
