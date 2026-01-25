export default function getCodeFromUrl(url:string){
    const urlParams = new URLSearchParams(url);
    return urlParams.get('code');
}