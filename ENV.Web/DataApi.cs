using Firefly.Box;
using Firefly.Box.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace ENV.Web
{
    public class DataApi
    {

        Dictionary<string, ApiItem> _controllers = new Dictionary<string, ApiItem>();
        public void Register(string key, Func<ViewModel> controller)
        {
            _controllers.Add(key.ToLower(), new ApiItem(key, controller));
        }
        bool PrgnameTypeRequest { get; set; }
        public bool DisableDocumentation { get; set; }

        class ApiItem
        {

            public string Name;
            Func<ViewModel> _factory;
            public ApiItem(string name, Func<ViewModel> factory)
            {
                Name = name;
                _factory = factory;
            }

            internal ViewModel Create()
            {
                return _factory();
            }
        }

        public void Register(string name, System.Type t, bool allowInsertUpdateDelete = false)
        {
            Register(name, () =>
            {
                var item = System.Activator.CreateInstance(t);
                var vmh = item as ViewModel;
                if (vmh != null)
                    return vmh;
                return
                new ViewModel((ENV.Data.Entity)item, allowInsertUpdateDelete);
            });
        }
        public void Register(System.Type t, bool allowInsertUpdateDelete = false)
        {
            InternalRegister(t, false, allowInsertUpdateDelete);
        }
        public void Register(ApplicationControllerBase app)
        {
            foreach (var item in app.AllEntities._entities)
            {
                Register(item.Value);
            }
        }
        void InternalRegister(System.Type t, bool onlyIfKeyNotAlreadyInUsed, bool allowInsertUpdateDelete = false)
        {
            var x = t.Name;
            if (x.EndsWith("ViewModel"))
                x = x.Remove(x.Length - 9);
            if (onlyIfKeyNotAlreadyInUsed && _controllers.ContainsKey(x))
                return;
            Register(x, t, allowInsertUpdateDelete);
        }
        public void TestApinameExists(string name, bool exists)
        {
            _controllers.ContainsKey(name.ToLower()).ShouldBe(exists, "Controller " + name + " exists");
        }
        public string ApiParameterName = "api";
        public string IdParameterName = "id";
        public string HttpMethodParamName { get; set; }
        public bool PostOnly { get; set; }
        public void ProcessRequestAspx()
        {
            PrgnameTypeRequest = true;
            var r = System.Web.HttpContext.Current.Request;
            ProcessRequest(r[ApiParameterName], r[IdParameterName]);

        }
        public void ProcessRequest(string name, string id = null)
        {
            ProcessRequest(name, id, new HttpContextBridgeToIHttpContext(HttpContext.Current, PostOnly, HttpMethodParamName));
        }
        void ProcessRequest(string name, string id, IMyHttpContext context)
        {
            var Request = context.Request;
            var Response = context.Response;
            try
            {
                Firefly.Box.Context.Current.SetNonUIThread();
                var responseType = (System.Web.HttpContext.Current.Request.Params["_response"] ?? "J").ToUpper();

                if (!PrgnameTypeRequest && !PostOnly)
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
                ENV.IO.WebWriter.ThereWasAnOutput();
                if (!string.IsNullOrWhiteSpace(name))
                {
                    ApiItem vmcFactory;
                    if (_controllers.TryGetValue(name.ToLower(), out vmcFactory))
                    {
                        var vmc = vmcFactory.Create();
                        {

                            Response.ContentType = "application/json";
                            var method = Request.HttpMethod.ToLower();

                            switch (method)
                            {
                                case "get":
                                    if (!vmc.AllowRead)
                                    {
                                        MethodNotAllowed(Response, vmc, method);
                                        return;
                                    }
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

                                        if (responseType.StartsWith("D")||responseType.ToLower().StartsWith("remult"))
                                        {
                                            Response.ContentType = "text/plain";
                                            sw.WriteLine("// /" + name + "?_responseType=" + responseType);
                                            sw.WriteLine();
                                            if (responseType.ToLower().StartsWith("remult"))
                                            {
                                                vmc.CreateTypeScriptRemultClass(sw, name);
                                                Response.ContentType = "application/text";
                                                Response.AddHeader("Content-Disposition", "attachment;filename="+name+".ts");
                                            }
                                            else if (responseType.StartsWith("DCF"))
                                                vmc.FullColumnList(sw);
                                            else if (responseType.StartsWith("DC"))
                                                vmc.ColumnKeys(sw);
                                            else
                                                vmc.CreateTypeScriptInterface(sw, name, Request.Path);
                                        }
                                        else if (string.IsNullOrEmpty(id))
                                            vmc.GetRows(Request).ToWriter(w);
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
                                    Response.AddHeader("Access-Control-Allow-Methods", allowedMethods);
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
                    if (DisableDocumentation)
                        return;
                    ResponseIsHtml(Response);
                    Response.Write(HTMLISerializedObjectWriter.HTMLPageHeader);
                    Response.Write("<div class=\"container\">");
                    Response.Write($"<h1>{Request.Path} Documentation</h1>");
                    foreach (var item in _controllers.Values)
                    {

                        Response.Write("<h2>" + item.Name + "</h2>");
                        string url = Request.Path;
                        if (PrgnameTypeRequest)
                        {
                            url = Request.RawUrl + "&" + ApiParameterName + "=" + item.Name;
                        }
                        else
                        {
                            if (!url.EndsWith("/"))
                                url += "/";
                            url += item.Name;
                        }
                        var sw = new StringBuilder();
                        void x(string linkName, string linkResponseType)
                        {
                            var linkUrl = url;
                            if (!string.IsNullOrEmpty(linkResponseType))
                            {
                                if (linkUrl.Contains("?"))
                                    linkUrl += "&";
                                else
                                    linkUrl += "?";
                                linkUrl += "_response=" + linkResponseType;
                            }
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
                            var c = item.Create();



                            var dl = new DataList();
                            void addLine(string action, bool dontNeedId = false)
                            {
                                var i = dl.AddItem();
                                i.Set("HTTP Method", action);
                                i.Set("URL", url +
                                    (dontNeedId ? "" : (this.PrgnameTypeRequest ? "&" + IdParameterName + "={id}" : "/{id}")) +
                                    (!string.IsNullOrEmpty(HttpMethodParamName) ? "&" + HttpMethodParamName + "=" + action : ""));

                            }
                            if (c.AllowRead)
                                addLine("GET", true);
                            if (c.AllowInsert)
                                addLine("POST", true);
                            if (c.AllowRead)
                                addLine("GET");
                            if (c.AllowUpdate)
                                addLine("PUT");
                            if (c.AllowDelete)
                                addLine("DELETE");

                            string api = dl.ToHTML();



                            dl = new DataList();
                            c.ProvideMembersTo(dl);
                            string bodyParameters = dl.ToHTML();

                            string getCodeSnippet(Action<System.IO.TextWriter> method)
                            {
                                using (var tw = new System.IO.StringWriter())
                                {
                                    method(tw);
                                    return ENV.UserMethods.Instance.XMLVal(tw.ToString());
                                }
                            }

                            Response.Write($@"
<div>

  <!-- Nav tabs -->
  <ul class=""nav nav-tabs"" role=""tablist"">
    <li role=""presentation"" class=""active""><a href=""#{item.Name}_api"" aria-controls=""api"" role=""tab"" data-toggle=""tab"">API</a></li>
    <li role=""presentation""><a href=""#{item.Name}_parameters"" aria-controls=""profile"" role=""tab"" data-toggle=""tab"">Body Parameters</a></li>
    <li role=""presentation""><a href=""#{item.Name}_settings"" aria-controls=""messages"" role=""tab"" data-toggle=""tab"">Typescript Interface</a></li>
    <li role=""presentation""><a href=""#{item.Name}_interface"" aria-controls=""settings"" role=""tab"" data-toggle=""tab"">Typescript remult</a></li>
    <li role=""presentation""><a href=""#{item.Name}_keys"" aria-controls=""keys"" role=""tab"" data-toggle=""tab"">Typescript Column Keys</a></li>
  </ul>

  <!-- Tab panes -->
  <div class=""tab-content"">
    <div role=""tabpanel"" class=""tab-pane active"" id=""{item.Name}_api"">{ api}</div>
    <div role=""tabpanel"" class=""tab-pane"" id=""{item.Name}_parameters"">{bodyParameters}</div>
    <div role=""tabpanel"" class=""tab-pane"" id=""{item.Name}_interface""><pre>{getCodeSnippet(tw => c.CreateTypeScriptRemultClass(tw, item.Name))}</pre><a href=""{url+ "?_response=remult"}"">download</a></div>
    <div role=""tabpanel"" class=""tab-pane"" id=""{item.Name}_settings""><pre>{getCodeSnippet(tw => c.CreateTypeScriptInterface(tw, item.Name, url))}</pre></div>
    <div role=""tabpanel"" class=""tab-pane"" id=""{item.Name}_keys""><pre>{getCodeSnippet(c.ColumnKeys)}</pre></div>
  </div>

</div>
");

                        }
                        catch (Exception ex)
                        {
                            Response.Write("Error: " + ex.Message);
                        }

                    }

                    Response.Write(optionalUrlParametersHtmlDoc);
                    Response.Write("</div>");
                    Response.Write(@"<script>" + StoredStuff.JQuery + @"</script>");
                    Response.Write(@"<script >" + StoredStuff.BootstrapJs + "</script>");

                }
            }
            finally
            {

            }
        }
        private static void PerformInsertOrUpdate(WebResponse Response, WebRequest Request, ViewModel vmc, bool allowed, string name, Func<DataItem, DataItem> action)
        {
            PerformInsertOrUpdateOrDelete(Response, vmc, allowed, name, () =>
            {
                DataItem r;
                r = action(DataItem.FromJson(Request.GetRequestInputString()));
                if (r == null && vmc.ModelState.IsValid)
                    vmc.ModelState.Message = "The request in invalid";

                return r;


            });
        }
        private static void PerformInsertOrUpdateOrDelete(WebResponse Response, ViewModel vmc, bool allowed, string name, Func<DataItem> action)
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
            catch (Firefly.Box.Data.DataProvider.DatabaseErrorException ex)
            {

                vmc.ModelState.AddError(ex.ErrorType.ToString());
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
        private static void MethodNotAllowed(WebResponse Response, ViewModel vmc, string name)
        {
            vmc.ModelState.AddError($"The requested resource does not support method '{name}'.");
            Response.Write(vmc.ModelState.ToJson());
            Response.StatusCode = 405;
            return;
        }

        private static DataItem DoIt(System.Web.HttpRequest Request, ViewModel vmc, Func<DataItem, DataItem> action)
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

        private static void ResponseIsHtml(WebResponse Response)
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
    <li><strong>__action</strong> - count => return the number of rows based on the filter</li>
    <li><strong>_gt, _gte, _lt, _lte, _ne, _st (starts with), _contains</strong> - Filter Data Options</li>
</ul>";
    }
    class NotFoundException : Exception
    { }



}
