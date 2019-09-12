const carousel = {
  type: 'template',
  altText: '',
  template: {
    type: 'carousel',
    columns: [],
    imageAspectRatio: 'rectangle',
    imageSize: 'cover'
  }
}

const columnTemplate = {
  title: '',
  text: '',
  actions: [
      {
        type: 'uri',
        label: 'Googleカレンダーに追加',
        uri: ''
      },
      {
        type: 'uri',
        label: '詳細',
        uri: ''
      }
  ]
}

module.exports = { carousel, columnTemplate };
