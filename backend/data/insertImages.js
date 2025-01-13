const Image = require('../models/Image')

const insertImages = async () => {
  const images = [{
    name: "avatar1",
    linkImage: "https://i.imgur.com/buF4Ijj.png"
  },
  {
    name: "avatar2",
    linkImage: "https://i.imgur.com/vr9KaNl.png"
  },
  {
    name: "avatar3",
    linkImage: "https://i.imgur.com/Pe4DI8Z.png"
  },
  {
    name: "avatar4",
    linkImage: "https://i.imgur.com/ZOZdwur.png"
  },
  {
    name: "avatar5",
    linkImage: "https://i.imgur.com/TK4Qovg.png"
  },
  {
    name: "avatar6",
    linkImage: "https://i.imgur.com/TCzisNy.png"
  },
  {
    name: "avatar7",
    linkImage: "https://i.imgur.com/BVmFcew.png"
  },
  {
    name: "avatar8",
    linkImage: "https://i.imgur.com/JCOzwRo.png"
  }, {
    name: "avatar9",
    linkImage: "https://i.imgur.com/wyzETiW.png"
  },
  {
    name: "avatar10",
    linkImage: "https://i.imgur.com/yuRYZRy.png"
  },
  {
    name: "avatar11",
    linkImage: "https://i.imgur.com/nGdj6Qn.png"
  },
  {
    name: "avatar12",
    linkImage: "https://i.imgur.com/59jMQjk.png"
  },
  ]

  for (const imageData of images) {
    const image = new Image(imageData)
    await image.save()
  }
}

module.exports = insertImages