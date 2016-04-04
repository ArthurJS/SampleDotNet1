using System.Collections.Generic;
using Geo4Students.Models.Domain.Determinatietabellen.Parameters;
using Geo4Students.Models.Domain.Klimatogrammen;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Geo4Students.Tests.Determinatie
{
    [TestClass]
    public class ParametersTest
    {
        private string antwoord;
        private Klimatogram k;
        private List<string> oplossingen;
        private Parameter tk, tw, mk, mw, nz, nw, d;

        [TestInitialize]
        public void MyInitializer()
        {
            tk = new Tk();
            tw = new Tw();
            mk = new Mk();
            mw = new Mw();
            nz = new Nz();
            nw = new Nw();
            d = new D();
            oplossingen = new List<string>();
            antwoord = "";
            VulKlimatogram();
        }

        private void VulKlimatogram()
        {
            var metingMadrid = new List<Meting>();
            var m = new Meting(1, 5.5, 42);
            metingMadrid.Add(m);
            m = new Meting(2, 7.0, 45);
            metingMadrid.Add(m);
            m = new Meting(3, 9.3, 30);
            metingMadrid.Add(m);
            m = new Meting(4, 11.6, 45);
            metingMadrid.Add(m);
            m = new Meting(5, 15.5, 39);
            metingMadrid.Add(m);
            m = new Meting(6, 20.4, 26);
            metingMadrid.Add(m);
            m = new Meting(7, 24.3, 9);
            metingMadrid.Add(m);
            m = new Meting(8, 23.8, 9);
            metingMadrid.Add(m);
            m = new Meting(9, 20.3, 28);
            metingMadrid.Add(m);
            m = new Meting(10, 14.5, 38);
            metingMadrid.Add(m);
            m = new Meting(11, 8.9, 59);
            metingMadrid.Add(m);
            m = new Meting(12, 5.9, 44);
            metingMadrid.Add(m);
            k = new Klimatogram("Madrid", "Weerstation Madrid", 40.38, -3.56, 1990, 2014);
            k.setMetingen(metingMadrid);
        }

        [TestMethod]
        public void TestAntwoordTk()
        {
            antwoord = "5,5";
            Assert.AreEqual(antwoord, tk.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenTk()
        {
            oplossingen = new List<string>
            {
                "5,5",
                "7,0",
                "9,3",
                "11,6",
                "15,5",
                "20,4",
                "24,3",
                "23,8",
                "20,3",
                "14,5",
                "8,9",
                "5,9"
            };
            Assert.AreEqual(oplossingen.ToString(), tk.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordTw()
        {
            antwoord = "24,3";
            Assert.AreEqual(antwoord, tw.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenTw()
        {
            Assert.AreEqual(oplossingen.ToString(), tw.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordMk()
        {
            antwoord = "Januari";
            Assert.AreEqual(antwoord, mk.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenMk()
        {
            oplossingen = new List<string>
            {
                "Januari",
                "Februari",
                "Maart",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Augustus",
                "September",
                "Oktober",
                "November",
                "December"
            };
            Assert.AreEqual(oplossingen.ToString(), mk.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordMw()
        {
            antwoord = "Juli";
            Assert.AreEqual(antwoord, mw.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenMw()
        {
            Assert.AreEqual(oplossingen.ToString(), mw.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordNz()
        {
            antwoord = "156";
            Assert.AreEqual(antwoord, nz.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenNz()
        {
            oplossingen = new List<string> {"156,258"};
            Assert.AreEqual(oplossingen.ToString(), mw.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordNw()
        {
            antwoord = "258";
            Assert.AreEqual(antwoord, nw.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenNw()
        {
            Assert.AreEqual(oplossingen.ToString(), mw.GeefMogelijkeAntwoorden(k).ToString());
        }

        [TestMethod]
        public void TestAntwoordD()
        {
            antwoord = "4";
            Assert.AreEqual(antwoord, d.Execute(k));
        }

        [TestMethod]
        public void TestAntwoordenD()
        {
            for (var i = 0; i < 13; i++)
            {
                oplossingen.Add(i.ToString());
            }
            Assert.AreEqual(oplossingen.ToString(), d.GeefMogelijkeAntwoorden(k).ToString());
        }
    }
}