using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain;

namespace Geo4Students
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            ModelBinders.Binders.Add(typeof (Jaar), new GraadSelectieModelBinder());
            Database.SetInitializer<GeoContext>(null);
        }
    }
}