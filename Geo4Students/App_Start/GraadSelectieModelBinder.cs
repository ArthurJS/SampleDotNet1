using System.Linq;
using System.Web.Mvc;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Repository;

namespace Geo4Students
{
    public class GraadSelectieModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var c = controllerContext.HttpContext.Request.Cookies["jaar"];

            if (c == null) return new Jaar(0);
            if (c.Value == null) return new Jaar(0);
            if (c.Value == "") return new Jaar(0);
            var context = new GeoContext();
            var repo = new JaarRepository(context);
            return repo.FindAll()
                .First(e => e.Leerjaar.ToString() == c.Value);
        }
    }
}