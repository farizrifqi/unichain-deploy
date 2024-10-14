export default function censorAddress(address) {
    const num = 7
    address = `${address.substring(0, num)}....${address.substring(address.length - num + 2)}`
    return address
}