
const widget = new ListWidget()
const gasInfo = await fetchGasInformation()
await createWidget()

Script.setWidget(widget)
Script.complete()

async function createWidget() {

    widget.addSpacer(4)
    const logoImg = await getImage('gas-logo.svg')

    widget.setPadding(10, 10, 10, 10)

    const logoStack = widget.addStack()
    logoStack.addSpacer(86)
    const logoImageStack = logoStack.addStack()
    logoStack.layoutHorizontally()
    logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
    logoImageStack.cornerRadius = 8
    const wimg = logoImageStack.addImage(logoImg)
    wimg.imageSize = new Size(40, 40)
    wimg.rightAlignImage()
    widget.addSpacer()

    const icon = await getImage('ether.png')
    let row = widget.addStack()
    row.layoutHorizontally()
    row.addSpacer(2)
    const iconImg = row.addImage(icon)
    iconImg.imageSize = new Size(40, 40)
    row.addSpacer(13)

    let column = row.addStack()
    column.layoutVertically()

    const paperText = column.addText("GAS PRICE")
    paperText.font = Font.mediumRoundedSystemFont(13)

    let computedGas = Math.trunc(parseInt(gasInfo.data.min) / 1_000_000_000)
    const gas = column.addText(computedGas.toString())
    gas.font = Font.mediumRoundedSystemFont(22)
    if (computedGas > 30) {
        gas.textColor = new Color("#E50000")
    } else {
        gas.textColor = new Color("#00CD66")
    }
    widget.addSpacer(4)
}

async function fetchGasInformation() {
    let url = 'https://www.gasnow.org/api/v3/block/latestOne?filter=y&utm_source=web'
    widget.url = 'https://www.gasnow.org/'
    let req = new Request(url)
    return await req.loadJSON()
}

async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        let imageUrl
        switch (image) {
            case 'gas-logo.svg':
                imageUrl = "https://downloads.sparkpool.com/gasnow/icons/eth.png"
                break
            case 'ether.png':
                imageUrl = "https://downloads.sparkpool.com/gasnow/icons/eth.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
