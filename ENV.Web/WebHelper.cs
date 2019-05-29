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
        internal static ContextStatic<IMyHttpContext> HttpContext = new ContextStatic<IMyHttpContext>(() => new HttpContextBridgeToIHttpContext(System.Web.HttpContext.Current));
        public static bool PostOnly { get; set; }
        public static string UseUrlBasedMethodParamName { get; set; }
        public static void ReturnJson(ISerializedObject item)
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
        public static DataItem DataItemFromJsonBody()
        {
            return DataItem.FromJson(HttpContext.Value.Request.GetRequestInputString());
        }
        public static objectType ObjectFromJsonBody<objectType>()
        {

            return JsonConvert.DeserializeObject<objectType>(HttpContext.Value.Request.GetRequestInputString());

        }
        public static dynamic DynamicFromJsonBody()
        {
          
                return JObject.Parse(HttpContext.Value.Request.GetRequestInputString());
            
        }
        private static void WriteJsonString(string s)
        {
            ENV.IO.WebWriter.ThereWasAnOutput();
            HttpContext.Value.Response.ContentType = "application/json";
            HttpContext.Value.Response.Write(s);
        }
        public static void ReturnJson(object o)
        {
            WriteJsonString(JsonConvert.SerializeObject(o));

        }
    }
}
