using System.Collections.Generic;
using Geo4Students.Models.Domain.Klimatogrammen;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Geo4Students.Tests.Klimatogrammen
{
    [TestClass]
    public class KlimatogramTest
    {
        private Klimatogram klimatogramNoord;
        private Klimatogram klimatogramZuid;
        private List<Meting> metingenNoord;
        private List<Meting> metingenZuid;

        [TestInitialize]
        public void Initialize()
        {
            klimatogramNoord = new Klimatogram("klimatogramNoord", "Gent", 51.05, 3.705, 1980, 2014);
            metingenNoord = new List<Meting>
            {
                new Meting(5,30.0,20),
                new Meting(8,10.0,25),
                new Meting(11,50,10),
                new Meting(2,20,5)
            };
            klimatogramNoord.setMetingen(metingenNoord);

            klimatogramZuid = new Klimatogram("klimatogramZuid", "Sydney", -33.87, 151.21, 1990, 2014);
            metingenZuid = new List<Meting>
            {
                new Meting(5,45,15),
                new Meting(8,15,10),
                new Meting(11,25,25),
                new Meting(2,5,30)
            };
            klimatogramZuid.setMetingen(metingenZuid);
        }

        [TestMethod]
        public void TestSomNeerslagZomerNoord()
        {
            Assert.AreEqual(45, klimatogramNoord.SomNeerslagZomer);
        }

        [TestMethod]
        public void TestSomNeerslagZomerZuid()
        {
            Assert.AreEqual(55, klimatogramZuid.SomNeerslagZomer);
        }

        [TestMethod]
        public void TestSomNeerslagWinterNoord()
        {
            Assert.AreEqual(15, klimatogramNoord.SomNeerslagWinter);
        }

        [TestMethod]
        public void TestSomNeerslagWinterZuid()
        {
            Assert.AreEqual(25, klimatogramZuid.SomNeerslagWinter);
        }

        [TestMethod]
        public void TestWarmsteMaand()
        {
            Assert.AreEqual("November", klimatogramNoord.WarmsteMaand);
        }

        [TestMethod]
        public void TestWarmsteTemp()
        {
            Assert.AreEqual(50, klimatogramNoord.WarmsteTemp);
        }

        [TestMethod]
        public void TestKoudsteTemp()
        {
            Assert.AreEqual(10, klimatogramNoord.KoudsteTemp);
        }

        [TestMethod]
        public void TestKoudsteMaand()
        {
            Assert.AreEqual("Augustus", klimatogramNoord.KoudsteMaand);
        }

        [TestMethod]
        public void TestDrogeMaanden()
        {
            Assert.AreEqual(3, klimatogramNoord.DrogeMaanden);
        }

        [TestMethod]
        public void TestTotaleNeerslag()
        {
            Assert.AreEqual(60, klimatogramNoord.TotaleNeerslag());
        }

        [TestMethod]
        public void TestGemiddeldeTemp()
        {
            Assert.AreEqual(9.17, klimatogramNoord.GemiddeldeTemp());
        }


    }
}