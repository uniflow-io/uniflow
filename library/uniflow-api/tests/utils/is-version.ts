// Regular expression used for basic parsing of the uuid.
const pattern = /^v[0-9]+\.[0-9]+\.[0-9]+$/i;

export default (version: string): Boolean => {
    return pattern.test(version)
}