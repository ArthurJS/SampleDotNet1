using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI.WebControls.WebParts;
using Geo4Students.Controllers;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Klimatogrammen;
using Geo4Students.Models.Repository;
using Geo4Students.ViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Geo4Students.Tests.Controllers
{
    [TestClass]
    public class KlimatogramControllerTest
    {
        private KlimatogramController controller;
        private Mock<IGenericRepository<Klimatogram>> mockKlimatogramRepository;
        private Mock<IGenericRepository<Land>> mockLandRepository;
        private DummyContext dummyContext = new DummyContext();

        [TestInitialize]
        public void MyTestInitializer()
        {
            mockKlimatogramRepository = new Mock<IGenericRepository<Klimatogram>>();
            mockLandRepository = new Mock<IGenericRepository<Land>>();
            mockLandRepository.Setup(l => l.Get(dummyContext.landID)).Returns(dummyContext.Land);
            mockKlimatogramRepository.Setup(l => l.Get(dummyContext.klimatogramID)).Returns(dummyContext.Klimatogram1);
            controller = new KlimatogramController(mockLandRepository.Object, mockKlimatogramRepository.Object);
        }

        [TestMethod]
        public void SelectContinentGeeftLandenMetKlimatogrammenDoorAanViewModel()
        {
            Jaar jaar = new Jaar();
            List<Continent> continenten = new List<Continent>();
            List<Land> landen = new List<Land>();
            List<Klimatogram> klimatogrammen = new List<Klimatogram>();
            Continent continent = new Continent { Naam = "Europa", ContinentId = 1 };
            Klimatogram klimatogram = new Klimatogram("k", "w", 1.0, 2.0, 1950, 2000);
            klimatogrammen.Add(klimatogram);
            Land land = new Land {Naam = "België", Klimatogrammen = klimatogrammen};
            landen.Add(land);
            continent.Landen = landen;
            continenten.Add(continent);
            jaar.Continenten = continenten;   
            PartialViewResult result = (PartialViewResult) controller.SelectContinent(jaar, 1);
            KlimatogramViewModel klimatogramVM = (KlimatogramViewModel) result.Model;
            Assert.AreEqual(land.Naam, klimatogramVM.Landen.ElementAt(0).Text);
            Assert.AreEqual("_LandenDropDown", result.ViewName);
        }

        [TestMethod]
        public void SelectLandGeeftKlimatogrammenDoorAanViewModel()
        {
            PartialViewResult result = controller.SelectLand(dummyContext.landID) as PartialViewResult;
            KlimatogramViewModel klimatogramVM = result.Model as KlimatogramViewModel;
            Assert.AreEqual(dummyContext.Klimatogrammen.ElementAt(0).Naam, klimatogramVM.Klimatogrammen.ElementAt(0).Text);
            Assert.AreEqual(dummyContext.Klimatogrammen.ElementAt(1).Naam, klimatogramVM.Klimatogrammen.ElementAt(1).Text);
            Assert.AreEqual("_KlimatogrammenDropDown", result.ViewName);
        }

        [TestMethod]
        public void SelectKlimatogramGeeftKlimatogramDoorAanViewModel()
        {
            PartialViewResult result = controller.SelectKlimatogram(dummyContext.klimatogramID) as PartialViewResult;
            KlimatogramViewModel klimatogramVM = result.Model as KlimatogramViewModel;
            Assert.AreEqual(dummyContext.klimatogramID, klimatogramVM.Klimatogram.KlimatogramId);
            Assert.AreEqual("_Klimatogram", result.ViewName);
        }
    }
}
