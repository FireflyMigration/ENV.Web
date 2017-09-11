using ENV.Labs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using ENV.Web;
namespace ENV.Web
{
    public class DataResult : System.Web.Mvc.ActionResult
    {
        ISerializedObject _r;
        Func<HttpResponseBase, TextWriter, ISerializedObjectWriter> _getWriter;
        public DataResult(ISerializedObject r, Func<HttpResponseBase, TextWriter, ISerializedObjectWriter> getWriter)
        {
            _getWriter = getWriter;
            _r = r;
        }


        public static implicit operator DataResult(DataList dl)
        {
            return ToResult(dl);
        }
        static DataResult ToResult(ISerializedObject r)
        {
            var response = System.Web.HttpContext.Current.Request.Params["_response"] ?? "J";
            response = response.ToUpper();
            switch (response[0])
            {
                case 'X':
                    return ToXmlResult(r);
                case 'C':
                    return ToCsvResult(r);
                case 'H':
                    return ToHTMLResult(r);
                default:
                    return ToJsonResult(r);
            }

        }



        static DataResult ToJsonResult(ISerializedObject r)
        {

            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "application/json";
                return new JsonISerializedObjectWriter(sw);
            });
        }
        static DataResult ToXmlResult(ISerializedObject r)
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "text/xml";
                return new XmlISerializedObjectWriter(new XmlTextWriter(sw));
            });
        }

        static DataResult ToCsvResult(ISerializedObject r, string downloadFileName = "data.csv")
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "application/csv";
                response.AddHeader("Content-Disposition", "attachment;filename=" + downloadFileName);
                return new CSVISerializedObjectWriter(sw);
            });
        }
        static DataResult ToHTMLResult(ISerializedObject r)
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "text/html";

                return new HTMLISerializedObjectWriter(sw);
            });
        }
        public override void ExecuteResult(System.Web.Mvc.ControllerContext context)
        {



            HttpResponseBase response = context.HttpContext.Response;



            DoResult(response);



        }

        internal void DoResult(HttpResponseBase response)
        {
            using (var sw = new StringWriter())
            {
                var ser = _getWriter(response, sw);
                _r.ToWriter(ser);
                ser.Dispose();
                response.Write(sw.ToString());
            }
        }
    }
}