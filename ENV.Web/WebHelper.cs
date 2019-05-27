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
        public static System.Web.HttpResponse Response { get { return System.Web.HttpContext.Current.Response; } }
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
            var Request = System.Web.HttpContext.Current.Request;
            Request.InputStream.Position = 0;
            using (var sr = new System.IO.StreamReader(Request.InputStream))
            {
                return DataItem.FromJson(sr.ReadToEnd());
            }
        }
        public static objectType ObjectFromJsonBody<objectType>()
        {
            var Request = System.Web.HttpContext.Current.Request;
            Request.InputStream.Position = 0;
            using (var sr = new System.IO.StreamReader(Request.InputStream))
            {
                return JsonConvert.DeserializeObject<objectType>(sr.ReadToEnd());
            }
        }
        public static dynamic DynamicFromJsonBody()
        {
            var Request = System.Web.HttpContext.Current.Request;
            Request.InputStream.Position = 0;
            using (var sr = new System.IO.StreamReader(Request.InputStream))
            {
                return JObject.Parse(sr.ReadToEnd());
            }
        }
        private static void WriteJsonString(string s)
        {
            ENV.IO.WebWriter.ThereWasAnOutput();
            Response.ContentType = "application/json";
            Response.Write(s);
        }
        public static void ReturnJson(object o)
        {
            WriteJsonString( JsonConvert.SerializeObject(o));

        }
    }
}
