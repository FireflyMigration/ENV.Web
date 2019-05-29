using Firefly.Box;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENV.Web
{
    public class WebHelper
    {
        IMyHttpContext _context;
        public WebHelper(bool postOnly=false) {
            
            _context = new HttpContextBridgeToIHttpContext(System.Web.HttpContext.Current, postOnly, null);
        }
        
        
        public void ReturnJson(ISerializedObject item)
        {
            using (var sw = new StringWriter())
            {
                using (var x = new JsonISerializedObjectWriter(sw))
                {
                    item.ToWriter(x);
                }

                WriteJsonString(sw.ToString());
            }
        }
        public  DataItem DataItemFromJsonBody()
        {
            return DataItem.FromJson(_context.Request.GetRequestInputString());
        }
        public  objectType ObjectFromJsonBody<objectType>()
        {

            return JsonConvert.DeserializeObject<objectType>(_context.Request.GetRequestInputString());

        }
        public  dynamic DynamicFromJsonBody()
        {
          
                return JObject.Parse(_context.Request.GetRequestInputString());
            
        }
        private  void WriteJsonString(string s)
        {
            ENV.IO.WebWriter.ThereWasAnOutput();
            _context.Response.ContentType = "application/json";
            _context.Response.Write(s);
        }
        public  void ReturnJson(object o)
        {
            WriteJsonString(JsonConvert.SerializeObject(o));

        }
    }
}
