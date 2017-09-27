using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace ENV.Web
{
    public class DataApiHelper
    {
        Dictionary<string, Func<ViewModelHelper>> _controllers = new Dictionary<string, Func<ViewModelHelper>>();
        public void Register(string key, Func<ViewModelHelper> controller)
        {
            _controllers.Add(key.ToLower(), controller);
        }
        public void RegisterEntityByDbName(System.Type t, bool allowInsertUpdateDelete = false)
        {
            var e = ((ENV.Data.Entity)System.Activator.CreateInstance(t));
            Register(e.EntityName, t, allowInsertUpdateDelete);
        }
        public void Register(string name, System.Type t, bool allowInsertUpdateDelete = false)
        {

            Register(name, () => new ViewModelHelper((ENV.Data.Entity)System.Activator.CreateInstance(t), allowInsertUpdateDelete));
        }
        public void RegisterEntityByClassName(System.Type t)
        {

            Register(t.Name, t);
        }
        public void ProcessRequest(string name, string id = null)
        {
            try
            {
                var Response = System.Web.HttpContext.Current.Response;
                var Request = System.Web.HttpContext.Current.Request;
                Firefly.Box.Context.Current.SetNonUIThread();
                var responseType = (System.Web.HttpContext.Current.Request.Params["_response"] ?? "J").ToUpper();
                Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                Response.Headers.Add("Access-Control-Allow-Headers", "content-type");
                {
                    var x = Request["HTTP_ORIGIN"];
                    if (!string.IsNullOrWhiteSpace(x))
                        Response.Headers.Add("Access-Control-Allow-Origin", x);
                }
                {//fix id stuff
                    var url = Request.RawUrl;
                    var z = url.IndexOf('?');
                    if (z >= 0)
                        url = url.Remove(z);
                    var x = url.Split('/');
                    id = null;
                    if (x[x.Length - 1] != name)
                        id = x[x.Length - 1];
                }
                if (!string.IsNullOrWhiteSpace(name))
                {
                    Func<ViewModelHelper> vmcFactory;
                    if (_controllers.TryGetValue(name.ToLower(), out vmcFactory))
                    {
                        var vmc = vmcFactory();
                        {

                            Response.ContentType = "application/json";
                            switch (Request.HttpMethod.ToLower())
                            {
                                case "get":
                                    using (var sw = new System.IO.StringWriter())
                                    {

                                        ISerializedObjectWriter w = new JsonISerializedObjectWriter(sw);
                                        if (responseType.StartsWith("X"))
                                        {
                                            w = new XmlISerializedObjectWriter(new XmlTextWriter(sw));
                                            Response.ContentType = "text/xml";
                                        }
                                        else if (responseType.StartsWith("C"))
                                        {
                                            w = new CSVISerializedObjectWriter(sw);
                                            Response.ContentType = "application/csv";
                                            Response.AddHeader("Content-Disposition", "attachment;filename=" + name + ".csv");
                                        }
                                        else if (responseType.StartsWith("H"))
                                        {
                                            ResponseIsHtml(Response);
                                            w = new HTMLISerializedObjectWriter(sw, name)
                                            {
                                                BodyAddition = optionalUrlParametersHtmlDoc
                                            };

                                        }
                                        if (responseType.StartsWith("D"))
                                        {
                                            Response.ContentType = "text/plain";
                                            sw.WriteLine("// /" + name + "?_responseType=" + responseType);
                                            sw.WriteLine();
                                            if (responseType.StartsWith("DE"))
                                                vmc.Describe(sw, name);
                                            else if (responseType.StartsWith("DCF"))
                                                vmc.FullColumnList(sw);
                                            else if (responseType.StartsWith("DC"))
                                                vmc.ColumnList(sw);
                                            else
                                                vmc.CreateTypeScriptClass(sw, name);
                                        }
                                        else if (string.IsNullOrEmpty(id))
                                            vmc.GetRows().ToWriter(w);
                                        else
                                            try
                                            {
                                                vmc.GetRow(id).ToWriter(w);
                                            }
                                            catch (NotFoundException)
                                            {
                                                vmc.ModelState.ApplyNotFound(Response);
                                                return;
                                            }
                                        w.Dispose();
                                        Response.Write(sw.ToString());
                                        break;
                                    }
                                case "post":
                                    PerformInsertOrUpdate(Response, Request, vmc, vmc.AllowInsert, "POST", di =>
                                    {
                                        var r = vmc.Insert(di);
                                        if (r != null)
                                            Response.StatusCode = 201;
                                        return r;
                                    });
                                    break;
                                case "put":
                                    PerformInsertOrUpdate(Response, Request, vmc, vmc.AllowUpdate, "PUT", di => vmc.Update(id, di));
                                    break;
                                case "delete":
                                    PerformInsertOrUpdateOrDelete(Response, vmc, vmc.AllowDelete, "DELETE", () =>
                                    {
                                        vmc.Delete(id);
                                        return null;
                                    });
                                    break;
                                case "options":
                                    var allowedMethods = "GET,HEAD,PATCH";
                                    if (vmc.AllowUpdate)
                                        allowedMethods += ",PUT";
                                    if (vmc.AllowInsert)
                                        allowedMethods += ",POST";
                                    if (vmc.AllowDelete)
                                        allowedMethods += ",DELETE";
                                    Response.Headers.Add("Access-Control-Allow-Methods", allowedMethods);
                                    Response.StatusCode = 204;
                                    return;
                                case "default":
                                    {
                                        MethodNotAllowed(Response, vmc, Request.HttpMethod);
                                    }
                                    break;
                            }

                        }
                    }
                    else
                    {
                        Response.StatusCode = 404;
                        return;
                    }
                }
                else
                {
                    ResponseIsHtml(Response);
                    Response.Write(HTMLISerializedObjectWriter.HTMLPageHeader);
                    Response.Write("<div class=\"container\">");
                    Response.Write($"<h1>{Request.Path} Documentation</h1>");
                    foreach (var item in _controllers)
                    {

                        Response.Write("<h2>" + item.Key + "</h2>");
                        string url = Request.Path;
                        if (!url.EndsWith("/"))
                            url += "/";
                        url += item.Key;
                        var sw = new StringBuilder();
                        void x(string linkName, string linkResponseType)
                        {
                            var linkUrl = url;
                            if (!string.IsNullOrEmpty(linkResponseType))
                                linkUrl += "?_response=" + linkResponseType;
                            if (sw.Length != 0)
                                sw.Append(" | ");
                            sw.Append($"<a href=\"{linkUrl}\">{linkName}</a> ");
                        };
                        x("JSON", "");
                        x("XML", "xml");
                        x("CSV", "csv");
                        x("HTML", "html");
                        
                        Response.Write(sw.ToString());

                       
                        try
                        {
                            var c = item.Value();
                            
                          
                            Response.Write("<h4>API:</h4>");
                           var  dl = new DataList();
                            void addLine(string action,bool dontNeedId = false)
                            {
                                var i = dl.AddItem();
                                i.Set("HTTP Method", action);
                                i.Set("URL", url + (dontNeedId ? "" : "/{id}"));
                                
                            }
                            addLine("GET", true);
                            addLine("GET");
                            if (c.AllowInsert)
                                addLine("POST");
                            if (c.AllowUpdate)
                                addLine("PUT");
                            if (c.AllowDelete)
                                addLine("DELETE");


                            Response.Write(dl.ToHTML());
                            Response.Write("<h4>Body Parameters:</h4>");
                            sw = new StringBuilder();
                            x("JSON Column List", "dcf");
                            x("JSON column Keys", "dc");
                            x("Typescript Interface", "d");
                            Response.Write(sw.ToString());
                            dl = new DataList();
                            c.ProvideMembersTo(dl);
                            Response.Write(dl.ToHTML());

                        }
                        catch (Exception ex)
                        {
                            Response.Write("Error: " + ex.Message);
                        }

                    }
                    Response.Write(optionalUrlParametersHtmlDoc);
                    Response.Write("</div>");
                }
            }
            finally
            {

            }
        }
        private static void PerformInsertOrUpdate(System.Web.HttpResponse Response, System.Web.HttpRequest Request, ViewModelHelper vmc, bool allowed, string name, Func<DataItem, DataItem> action)
        {
            PerformInsertOrUpdateOrDelete(Response, vmc, allowed, name, () =>
            {
                DataItem r;
                Request.InputStream.Position = 0;
                using (var sr = new System.IO.StreamReader(Request.InputStream))
                {
                    r = action(DataItem.FromJson(sr.ReadToEnd()));
                    if (r == null && vmc.ModelState.IsValid)
                        vmc.ModelState.Message = "The request in invalid";
                }

                return r;


            });
        }
        private static void PerformInsertOrUpdateOrDelete(System.Web.HttpResponse Response, ViewModelHelper vmc, bool allowed, string name, Func<DataItem> action)
        {
            if (!allowed)
            {
                MethodNotAllowed(Response, vmc, name);
                return;
            }


            DataItem r = null;
            try
            {
                r = action();
            }
            catch (NotFoundException)
            {
                vmc.ModelState.ApplyNotFound(Response);

                return;
            }
            catch (Exception ex)
            {
                vmc.ModelState.AddError(ex);
            }

            if (!vmc.ModelState.IsValid)
            {
                Response.Write(vmc.ModelState.ToJson());
                Response.StatusCode = 400;
            }
            else if (r != null)
                Response.Write(r.ToJson());


        }
        private static void MethodNotAllowed(HttpResponse Response, ViewModelHelper vmc, string name)
        {
            vmc.ModelState.AddError($"The requested resource does not support http method '{name}'.");
            Response.Write(vmc.ModelState.ToJson());
            Response.StatusCode = 405;
            return;
        }

        private static DataItem DoIt(System.Web.HttpRequest Request, ViewModelHelper vmc, Func<DataItem, DataItem> action)
        {
            DataItem r;
            Request.InputStream.Position = 0;
            using (var sr = new System.IO.StreamReader(Request.InputStream))
            {
                r = action(DataItem.FromJson(sr.ReadToEnd()));
                if (r == null && vmc.ModelState.IsValid)
                    vmc.ModelState.Message = "The request in invalid";
            }

            return r;
        }

        private static void ResponseIsHtml(System.Web.HttpResponse Response)
        {
            Response.ContentType = "text/html";
        }
        private const string optionalUrlParametersHtmlDoc = @"
<strong>Optional Url Parameters</strong>
<ul>
    <li><strong>_limit</strong> - Num of rows per result</li>
    <li><strong>_page</strong> - Page Number</li>
    <li><strong>_sort</strong> - Sort Columns</li>
    <li><strong>_order</strong> - Sort Direction</li>
    <li><strong>_gt, _gte, _lt, _lte, _ne</strong> - Filter Data Options</li>
</ul>";
    }
    class NotFoundException : Exception
    { }
}
