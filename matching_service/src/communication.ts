const QIDS = ["6542bf9aa0343bd9c2e35245","6542bf9aa0343bd9c2e35249","6542bf9aa0343bd9c2e3524d", "6542bf9aa0343bd9c2e35265"]


export const fetchRandQn = async (low: number, high: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return QIDS[Math.floor(Math.random() * QIDS.length)];
}
