
export class AuthUtils
{
    constructor()
    {
    }
    static isTokenExpired(token: string, offsetSeconds?: number): boolean
    {
        if ( !token || token === '' )
        {
            return true;
        }
        const date = this._getTokenExpirationDate(token);

        offsetSeconds = offsetSeconds || 0;

        if ( date === null )
        {
            return true;
        }
        
        return !(date.valueOf() > new Date().valueOf() + offsetSeconds);
    }
    private static _decodeToken(token: string): any
    {
        if ( !token )
        {
            return null;
        }
        let parts = "";
        try{
            parts = JSON.parse(token);
        }catch(e){
            return "";
        }
        //console.log(JSON.parse(token).hasOwnProperty('expires_in'))
        
        return JSON.parse(token);
    }

    private static _getTokenExpirationDate(token: string): Date | null
    {

        const decodedToken = this._decodeToken(token);

        if ( !decodedToken.hasOwnProperty('expires_in') )
        {
            return null;
        }
        const date = new Date();
        date.setUTCSeconds(decodedToken.expires_in);
        return date;
    }
}
