
const icons = require('../icons.json')
const extensions = {}
for (var icon in icons) {
    icons[icon].forEach(ext => {
        extensions[ext] = icon
    });
}

export const getExtIcon = (ext: string) => {
    const icon = extensions[ext]
    if (icon) return 'file-icons/file_type_' + icon + '.svg'
}