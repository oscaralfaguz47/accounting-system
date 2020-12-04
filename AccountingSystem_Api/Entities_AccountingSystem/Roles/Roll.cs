using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Entities_AccountingSystem.Roles
{
    public class Roll
    {
        [Required]
        public int IdRoll { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
