namespace ENV.Web
{
    interface IMyHttpContext
    {
        string GetRequestParam(string key);
    }
    class HttpContextBridgeToIHttpContext : IMyHttpContext
    {
        System.Web.HttpContext _current;


        public HttpContextBridgeToIHttpContext(System.Web.HttpContext current)
        {
            _current = current;
        }

        public string GetRequestParam(string key)
        {
            return _current.Request.Params[key];
        }
    }
}
