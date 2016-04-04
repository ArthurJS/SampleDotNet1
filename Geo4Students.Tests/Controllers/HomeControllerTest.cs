using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;
using Geo4Students.Controllers;
using Geo4Students.Models.Domain;
using Geo4Students.ViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Geo4Students.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        private Jaar jaar1;
        private Jaar jaar2;
        private HomeController controller;

        [TestInitialize]
        public void MyTestInitializer()
        {
            jaar1 = new Jaar(0);
            jaar2 = new Jaar(1);
            controller = new HomeController();
        }

        [TestMethod]
        public void IndexNaarJaar()
        {
            RedirectToRouteResult result = (RedirectToRouteResult) controller.Index(jaar1);
            Assert.AreEqual("Jaar", result.RouteValues["Action"]);
            Assert.AreEqual("Home", result.RouteValues["Controller"]);
        }

        [TestMethod]
        public void IndexNaarStart()
        {
            RedirectToRouteResult result = (RedirectToRouteResult)controller.Index(jaar2);
            Assert.AreEqual("Start", result.RouteValues["Action"]);
            Assert.AreEqual("Home", result.RouteValues["Controller"]);
        }

        [TestMethod]
        public void JaarGeeftJarenDoorAanViewModel()
        {
            ViewResult result = controller.Jaar() as ViewResult;
            JaarViewModel jaarVM = result.Model as JaarViewModel;
            string[] jaren =
            {
                "1ste jaar",
                "2de jaar",
                "3de jaar",
                "4de jaar",
                "5de jaar",
                "6de jaar"
            };
            for (int i = 0; i < jaarVM.SubjectList.Count; i++)
            {
                Assert.AreEqual(jaren.ElementAt(i), jaarVM.SubjectList.ElementAt(i));
            }
        }

        [TestMethod]
        public void AlsGeenJaarGekozenGaNaarJaar()
        {
            JaarViewModel jaarVM = new JaarViewModel();
            RedirectToRouteResult result = (RedirectToRouteResult) controller.JaarConfirmed(jaarVM);
            Assert.AreEqual("Jaar", result.RouteValues["Action"]);
        }

        //Cookie zorgt nog voor fout
        //[TestMethod]
        //public void AlsJaarGekozenGaNaarStart()
        //{
        //    JaarViewModel jaarVM = new JaarViewModel {SelectedJaar = "1ste jaar"};
        //    RedirectToRouteResult result = (RedirectToRouteResult) controller.JaarConfirmed(jaarVM);
        //    Assert.AreEqual("Start", result.RouteValues["Action"]);
        //    Assert.AreEqual("Home", result.RouteValues["Controller"]);
        //}

        
    }
}
