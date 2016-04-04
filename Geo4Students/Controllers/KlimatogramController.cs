using System.Linq;
using System.Web.Mvc;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Klimatogrammen;
using Geo4Students.Models.Repository;
using Geo4Students.ViewModels;

namespace Geo4Students.Controllers
{
    public class KlimatogramController : Controller
    {
        private readonly IGenericRepository<Klimatogram> _klimatogramRepository;
        private readonly IGenericRepository<Land> _landRepository;

        public KlimatogramController(IGenericRepository<Land> landRepository,
            IGenericRepository<Klimatogram> klimatogramRepository)
        {
            _landRepository = landRepository;
            _klimatogramRepository = klimatogramRepository;
        }

        [HttpGet]
        public ActionResult SelectContinent(Jaar jaar, int selectedContinentId)
        {
            var klimatogramViewModels = new KlimatogramViewModel
            {
                Landen =
                    new SelectList(
                        jaar.Continenten.First(i => i.ContinentId == selectedContinentId)
                            .Landen.Where(e => e.Klimatogrammen.Count > 0)
                            .OrderBy(x => x.Naam), "LandId", "Naam")
            };
            return PartialView("_LandenDropDown", klimatogramViewModels);
        }

        [HttpGet]
        public ActionResult SelectLand(int selectedLandId)
        {
            var klimatogramViewModels = new KlimatogramViewModel
            {
                Klimatogrammen =
                    new SelectList(_landRepository.Get(selectedLandId).Klimatogrammen.OrderBy(x => x.Naam),
                        "KlimatogramId", "Naam")
            };
            return PartialView("_KlimatogrammenDropDown", klimatogramViewModels);
        }

        [HttpGet]
        public ActionResult SelectKlimatogram(int selectedKlimatogramId)
        {
            var klimatogramViewModels = new KlimatogramViewModel
            {
                Klimatogram = _klimatogramRepository.Get(selectedKlimatogramId)
            };
            return PartialView("_Klimatogram", klimatogramViewModels);
        }
    }
}