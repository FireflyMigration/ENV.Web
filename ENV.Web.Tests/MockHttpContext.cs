using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENV.Web.Tests
{
    class MockHttpContext : ENV.Web.IMyHttpContext
    {
        public string GetRequestParam(string key)
        {
            return null;
        }
    }
}
