using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.Models.Repository
{
    public class ComponentRepository : IGenericRepository<DeterminatieComponent>
    {
        private readonly DbSet<DeterminatieComponent> _componenten;
        private readonly GeoContext _context;

        public ComponentRepository(GeoContext context)
        {
            _context = context;
            _componenten = _context.DeterminatieComponent;
        }

        public IQueryable<DeterminatieComponent> FindAll()
        {
            return _componenten;
        }

        public DeterminatieComponent Get(object id)
        {
            return _componenten.Find(id);
        }

        public void Delete(DeterminatieComponent obj)
        {
            _componenten.Remove(obj);
        }

        public void Insert(DeterminatieComponent obj)
        {
            _componenten.Add(obj);
        }

        public bool Exists(object id)
        {
            return _componenten.Contains(id);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}