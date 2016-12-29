using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elektronova_konfigurace
{
    class Config
    {
        private int protonNumber;
        private List<char> letterList;
        private List<char> unsortedLetterList;
        private string log;
        public List<int> electrons;
        public string[] Elements = new string[] { "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og" };

        public Config(int protonNumber)
        {
            this.protonNumber = protonNumber;

            letterList = new List<char>();
            letterList.Add('s');
            unsortedLetterList = new List<char>();
            unsortedLetterList.Add('s');
            log = "Elektronová konfigurace po vrstvách:\n\n";
            electrons = new List<int>();
        }


        public string Generate()
        {
            int vrstva = 1;

            // Repeat until all electrons are positioned
            while (electrons.Sum() < protonNumber)
            {
                bool exit = false;
                // Add new line of electrons
                electrons.Add(0);
                log += $"{(vrstva.ToString() + ")").PadRight(4)}";


                // Do the line
                foreach (char letter in letterList)
                {
                    int maxEl = 2;

                    maxEl += unsortedLetterList.IndexOf(letter) * 4;


                    if ((vrstva == 6 || vrstva == 7) && letter == letterList[1] /* A ZAROVEN TO NENI VZACNY PLYN */ && protonNumber - (electrons.Sum() - electrons.Last()) <= 17)
                    {
                        electrons[(vrstva + getLetterBonus('d')) - 1]++;
                        log += $"{(vrstva + getLetterBonus('d')).ToString()}d{GetUpperIndexOfNumber(1)} ";
                        maxEl--;
                    }



                    // Do all electrons in current 'letter'
                    int i = 0;
                    for (i = 0; i < maxEl; i++)
                    {


                        if (electrons.Sum() >= protonNumber)
                        {
                            exit = true;
                            break;
                        }


                        int vrstvaKPridani = (vrstva + getLetterBonus(letter)) - 1;

                        electrons[vrstvaKPridani]++;
                    }

                    if (letter == 'd')
                    {
                        if (i == 4 || i == 9)
                        {
                            i++;
                            electrons[(vrstva + getLetterBonus('d')) - 1]++;
                            electrons[vrstva - 1]--;
                            log = log.Replace($"{vrstva.ToString()}s²", $"{vrstva.ToString()}s{GetUpperIndexOfNumber(1)}");
                        }
                    }
                    else if (letter == 'f')
                    {
                        if (i == 6 || i == 13)
                        {
                            i++;
                            electrons[(vrstva + getLetterBonus('f')) - 1]++;
                            if (!log.Contains($"{vrstva + getLetterBonus('d')}d{GetUpperIndexOfNumber(1)}"))
                            {
                                log = log.Replace($"{vrstva.ToString()}s²", $"{vrstva.ToString()}s{GetUpperIndexOfNumber(1)}");
                                electrons[vrstva - 1]--;
                            }
                            else
                            {
                                electrons[vrstva - 1 + getLetterBonus('d')]--;
                                log = log.Replace($"{(vrstva + getLetterBonus('d')).ToString()}d{GetUpperIndexOfNumber(1)} ", "");
                            }
                        }
                    }


                    if (exit)
                    {
                        if (i != 0)
                            log += (vrstva + getLetterBonus(letter)).ToString() + letter.ToString() + GetUpperIndexOfNumber(i);
                        break;
                    }
                    else if (i != 0)
                        log += (vrstva + getLetterBonus(letter)).ToString() + letter.ToString() + GetUpperIndexOfNumber(maxEl) + " ";

                }
                log += "\n";
                vrstva++;
                AddLetter(vrstva);
            }


            int j = 0;
            log += "\n\n\nPočty elektronů v jednotlivých vrstvách:\n\n";
            foreach (int e in electrons)
            {
                log += $"{((j + 1).ToString() + ")").PadRight(4)}{e}\n";
                j++;
            }


            return log;
        }


        private string GetUpperIndexOfNumber(int number)
        {
            string s = "";

            char nmbr = number.ToString().First();

            switch (nmbr)
            {
                case '1':
                    s += "¹";
                    break;
                case '2':
                    s += "²";
                    break;
                case '3':
                    s += "³";
                    break;
                case '4':
                    s += "⁴";
                    break;
                case '5':
                    s += "⁵";
                    break;
                case '6':
                    s += "⁶";
                    break;
                case '7':
                    s += "⁷";
                    break;
                case '8':
                    s += "⁸";
                    break;
                case '9':
                    s += "⁹";
                    break;
                case '0':
                    s += "⁰";
                    break;
            }

            if (number.ToString().Length > 1)
                s += GetUpperIndexOfNumber(int.Parse(number.ToString().Substring(1)));

            return s;
        }


        private void AddLetter(int vrstva)
        {
            if (!letterList.Contains('p'))
            {
                if (vrstva > 1)
                {
                    letterList.Add('p');
                    unsortedLetterList.Add('p');
                }
            }
            else if (!letterList.Contains('d'))
            {
                if (vrstva > 3)
                {
                    letterList.Insert(1, 'd');
                    unsortedLetterList.Add('d');
                }
            }
            else if (!letterList.Contains('f'))
            {
                if (vrstva > 5)
                {
                    letterList.Insert(1, 'f');
                    unsortedLetterList.Add('f');
                }
            }
            else
            {
                if (vrstva > (5 + ((((letterList[1] + 1) - 'f' == 0) ? 1 : (letterList[1] + 1) - 'f') * 2)))
                {
                    unsortedLetterList.Add((char)(letterList[1] + 1));
                    letterList.Insert(1, (char)(letterList[1] + 1));
                }
            }
        }


        private int getLetterBonus(char letter)
        {
            int bonus = 0;

            if (letter != 'p' && letter != 's')
            {
                if (letter == 'd')
                    bonus = -1;
                else if (letter == 'f')
                    bonus = -2;
                else
                    bonus = -2 - (letter - 'f');
            }

            return bonus;
        }
    }
}
