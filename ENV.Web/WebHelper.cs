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
        internal ContextStatic<IMyHttpContext> HttpContext;
        public WebHelper() {
            HttpContext = 
            new ContextStatic<IMyHttpContext>(() =>
            new HttpContextBridgeToIHttpContext(System.Web.HttpContext.Current, PostOnly, null));
        }
        public  bool PostOnly { get; set; }
        
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
            return DataItem.FromJson(HttpContext.Value.Request.GetRequestInputString());
        }
        public  objectType ObjectFromJsonBody<objectType>()
        {

            return JsonConvert.DeserializeObject<objectType>(HttpContext.Value.Request.GetRequestInputString());

        }
        public  dynamic DynamicFromJsonBody()
        {
          
                return JObject.Parse(HttpContext.Value.Request.GetRequestInputString());
            
        }
        private  void WriteJsonString(string s)
        {
            ENV.IO.WebWriter.ThereWasAnOutput();
            HttpContext.Value.Response.ContentType = "application/json";
            HttpContext.Value.Response.Write(s);
        }
        public  void ReturnJson(object o)
        {
            WriteJsonString(JsonConvert.SerializeObject(o));

        }
    }
}
