<script setup lang="ts">
import { computed } from 'vue'
import {
    InlineEditor, Essentials, Paragraph, Bold, Heading,
    Table, TableToolbar, TableCaption, TableColumnResize, TableCellProperties,
    Subscript, Superscript, RemoveFormat, FindAndReplace, SelectAll, Alignment, List, BlockQuote,
    Image, ImageToolbar, ImageResize, ImageStyle, ImageCaption, ImageInsert, ImageResizeEditing, ImageResizeHandles, SimpleUploadAdapter,
    Link, AutoLink, LinkImage,
    SourceEditing, GeneralHtmlSupport, CodeBlock,
} from 'ckeditor5'
import coreTranslations from 'ckeditor5/translations/ja.js'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'

import 'ckeditor5/ckeditor5.css'

interface Props {
    content: string
}

const props = withDefaults(defineProps<Props>(), {
    content: '<h2>見出し</h2><p>本文</p>',
})

const emits = defineEmits(['update:content'])
const _content = ref(props.content)

const updateContent = (data: string) => {
    emits('update:content', data)
}

const config = computed(() => {
    return {
        licenseKey: 'GPL',
        plugins: [
            Essentials, Heading, Paragraph, Bold, Subscript, Superscript, RemoveFormat,
            Link, AutoLink, LinkImage,
            FindAndReplace, SelectAll, List, BlockQuote, Alignment,
            Table, TableToolbar, TableCaption, TableColumnResize, TableCellProperties,
            Image, ImageToolbar, ImageResize, ImageStyle, ImageCaption, ImageInsert, ImageResizeEditing, ImageResizeHandles, SimpleUploadAdapter,
            SourceEditing, GeneralHtmlSupport, CodeBlock,
        ],
        toolbar: [
            'sourceEditing',
            '|', 'undo', 'redo',
            '|', 'heading',
            '|', 'bold',
            '|', 'numberedList', 'bulletedList',
            '|', 'blockQuote',
            '|', 'alignment',
            '|', 'imageUpload',
            '|', 'link',
            '|', 'codeBlock',
            '|', 'insertTable',
            '|', 'removeFormat', 'findAndReplace', 'selectAll', 'subscript', 'superscript',
        ],
        translations: [
            coreTranslations,
        ],
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'toggleTableCaption', 'tableCellProperties'],
        },
        simpleUpload: {
            uploadUrl: '/api/manage/img/upload',
            withCredentials: true,
            headers: {
                Authorization: `JWT`,
                // 'Content-Type': 'multipart/form-data',
            },
        },
        image: {
            insert: {
                integrations: ['upload', 'url'],
            },
            toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'linkImage'],
        },
        link: {
            toolbar: ['linkPreview', '|', 'editLink', 'linkProperties', 'unlink'],
            addTargetToExternalLinks: true,
            decorators: {
                isExternal: {
                    mode: 'automatic',
                    callback: (url: string) => /^(https?:)?\/\//.test(url),
                    attributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                    },
                },
                isDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'download',
                    },
                },
            },
        },
        ui: {
            viewportOffset: { top: 80, right: 10, bottom: 10, left: 10 },
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    classes: {
                        'correct-tooltip': true,
                        'correct-tooltip-1': true,
                        'correct-tooltip-2': true,
                    },
                    attributes: {
                        'data-tooltip': true,
                    },
                },
            ],
        },
    }
})

watch(
    () => props.content, () => {
        _content.value = props.content
    },
)
</script>

<template>
    <ckeditor
        v-model="_content"
        :editor="InlineEditor"
        :config="config"
        @update:model-value="updateContent"
    />
</template>
