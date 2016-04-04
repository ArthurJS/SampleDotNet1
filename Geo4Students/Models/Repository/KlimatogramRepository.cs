using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Repository
{
    public class KlimatogramRepository : IGenericRepository<Klimatogram>
    {
        private readonly GeoContext _context;
        private readonly DbSet<Klimatogram> _klimatogrammen;

        public KlimatogramRepository(GeoContext context)
        {
            _context = context;
            _klimatogrammen = _context.Klimatogram;
        }

        public IQueryable<Klimatogram> FindAll()
        {
            return _klimatogrammen;
        }

        public Klimatogram Get(object id)
        {
            return _klimatogrammen.Find(id);
        }

        public void Delete(Klimatogram obj)
        {
            _klimatogrammen.Remove(obj);
        }

        public void Insert(Klimatogram obj)
        {
            _klimatogrammen.Add(obj);
        }

        public bool Exists(object id)
        {
            return _klimatogrammen.Find(id) != null;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}