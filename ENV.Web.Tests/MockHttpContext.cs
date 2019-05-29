using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENV.Web.Tests
{
    class MockHttpContext : ENV.Web.IMyHttpContext, WebRequest, WebResponse
    {
        public string this[string key] => null;

        public WebRequest Request => this;

        public WebResponse Response => this;

        public string HttpMethod { get; set; }

        public string RawUrl { get; set; }

        public string Path { get; set; }

        public string ContentType { get; set; }
        public int StatusCode { get; set; }

        public void AddHeader(string name, string value)
        {
            throw new NotImplementedException();
        }

        public string GetRequestInputString()
        {
            throw new NotImplementedException();
        }

        public string GetRequestParam(string key)
        {
            throw new NotImplementedException();
        }

        public void Write(string what)
        {
            throw new NotImplementedException();
        }
    }
}
