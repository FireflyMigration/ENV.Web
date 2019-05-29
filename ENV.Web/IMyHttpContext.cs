﻿
namespace ENV.Web
{
    interface IMyHttpContext
    {
        string GetRequestParam(string key);
        WebRequest Request { get; }
        WebResponse Response { get; }
    }
    interface WebRequest
    {
        string HttpMethod { get; }
        string RawUrl { get; }
        string Path { get; }

        string this[string key] { get; }
        string GetRequestInputString();
    }
    interface WebResponse
    {
        string ContentType { get; set; }
        int StatusCode { set; }

        void AddHeader(string name, string value);
        void Write(string what);
    }
    class HttpContextBridgeToIHttpContext : IMyHttpContext
    {
        System.Web.HttpContext _current;


        public HttpContextBridgeToIHttpContext(System.Web.HttpContext current)
        {
            _current = current;
            Request = new WebReqestBridgeToRequest(current.Request);
            Response = new WebResponseBridgeToResponse(current.Response);
        }

        public WebRequest Request { get; private set; }

        public WebResponse Response { get; private set; }

        public string GetRequestParam(string key)
        {
            return _current.Request.Params[key];
        }
    }
    internal class WebReqestBridgeToRequest : WebRequest
    {
        System.Web. HttpRequest _request;

        public WebReqestBridgeToRequest(System.Web.HttpRequest request)
        {
            _request = request;
        }
        public string GetRequestInputString()
        {
            _request.InputStream.Position = 0;
            using (var sr = new System.IO.StreamReader(_request.InputStream))
            {
                return sr.ReadToEnd();
            }

        }

        public string HttpMethod => _request.HttpMethod;

        public string RawUrl => _request.RawUrl;

        public string Path => _request.Path;

        public string this[string key] => _request[key];
    }
    internal class WebResponseBridgeToResponse : WebResponse
    {
        System.Web.HttpResponse _response;

        public WebResponseBridgeToResponse(System.Web.HttpResponse response)
        {
            _response = response;
        }

        public string ContentType { get => _response.ContentType; set => _response.ContentType = value; }
        public int StatusCode { set => _response.StatusCode = value; }

        public void AddHeader(string name, string value)
        {
            _response.AddHeader(name, value);
        }

        public void Write(string what)
        {
            _response.Write(what);
        }

     
    }
   

}
