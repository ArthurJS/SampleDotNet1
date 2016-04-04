using System.Collections.Generic;
using System.Linq;
using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.ViewModels
{
    public class DeterminatieViewModel
    {
        private readonly IList<DeterminatieResultaat> results = new List<DeterminatieResultaat>();

        public DeterminatieViewModel(Determinatietabel tabel)
        {
            Determinatietabel = tabel;
            MaxX = BerekenMaxX(Determinatietabel.Component, 0);
            Initialize();
        }

        public int MaxY { get; set; }
        public IList<ComponentViewModel> ComponentViewModels { get; set; }
        public Determinatietabel Determinatietabel { get; set; }
        public IList<DeterminatieComponent> Componenten { get; set; }
        public int MaxX { get; set; }

        private void Initialize()
        {
            ComponentViewModels = new List<ComponentViewModel>();
            CreateComponentViewModels(Determinatietabel.Component, null);
        }

        private void CreateComponentViewModels(DeterminatieComponent component, ComponentViewModel parent)
        {
            int x;
            if (component is DeterminatieVoorwaarde)
            {
                var temp = component as DeterminatieVoorwaarde;
                if (temp.Parent == null)
                {
                    x = 10;
                    MaxY = 10;
                }
                else
                {
                    var ouder = temp.Parent as DeterminatieVoorwaarde;
                    if (ouder.Yes == temp)
                    {
                        x = parent.X + 150;
                    }
                    else
                    {
                        x = parent.X;
                        MaxY += 65;
                    }
                }
                var cvm = new ComponentViewModel
                {
                    X = x,
                    Y = MaxY,
                    DeterminatieComponent = temp,
                    Parent = parent
                };
                ComponentViewModels.Add(cvm);
                CreateComponentViewModels(temp.Yes, cvm);
                CreateComponentViewModels(temp.No, cvm);
            }
            else
            {
                var temp = component.Parent as DeterminatieVoorwaarde;
                if (temp.No == component)
                {
                    MaxY += 65;
                }
                var cvm = new ComponentViewModel
                {
                    X = MaxX*165,
                    Y = MaxY,
                    DeterminatieComponent = component,
                    Parent = parent
                };
                ComponentViewModels.Add(cvm);
            }
        }

        public DeterminatieComponent GetComponentById(int id)
        {
            return Componenten.First(e => e.ComponentId == id);
        }

        public int BerekenMaxX(DeterminatieComponent component, int breedte)
        {
            if (component is DeterminatieResultaat)
            {
                return ++breedte;
            }
            var temp = component as DeterminatieVoorwaarde;
            if (temp.Parent != null)
            {
                var tempParent = component.Parent as DeterminatieVoorwaarde;
                if (tempParent.Yes == temp)
                {
                    ++breedte;
                }
            }
            if (BerekenMaxX(temp.Yes, 0) > BerekenMaxX(temp.No, 0))
            {
                return BerekenMaxX(temp.Yes, breedte);
            }
            return BerekenMaxX(temp.No, breedte);
        }

        public List<DeterminatieResultaat> GeefResultaten()
        {
            return (from cm in ComponentViewModels
                where cm.DeterminatieComponent is DeterminatieResultaat
                select cm.DeterminatieComponent as DeterminatieResultaat).ToList();
        }
    }
}