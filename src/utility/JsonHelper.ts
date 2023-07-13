class JsonHelper
{
    public static Parse<T>(json: any): T {
        return JSON.parse(JSON.stringify(json)) as T
    }
}

export default JsonHelper