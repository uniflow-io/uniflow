const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default (uid: string): Boolean => {
    return checkUUID.test(uid)
}