using ENV.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENV.Web
{
    class NameFixer
    {
        public static string fixName(string name)
        {
            name = EntityScriptGenerator.FixNameForDb(HebrewTranslateCsStyle(name));
            if (name.Length >= 2)

                return name[0].ToString().ToLower() + name.Substring(1);
            else if (name.Length == 1)
                name = name.ToLower();
            return name;
        }
        public static string HebrewTranslateCsStyle(string source)
        {
            string splitedSource = source;

            StringBuilder output = new StringBuilder();
            foreach (string s in splitedSource.Split(' '))
            {
                var y = s;
                if (HasHebrewInIt(y))
                {
                    y = HebrewTranslateOracleStyle(y);
                    if (y.Length > 0)
                        y = y.Substring(0, 1).ToUpper() + y.Remove(0, 1).ToLower();
                }
                else
                    if (y.Length > 0)
                        y = y.Substring(0, 1).ToUpper() + y.Remove(0, 1);

                output.Append(y);


            }
            return output.ToString();
        }
        public static string HebrewTranslateOracleStyle(string source)
        {
            string hebrewEngish = "ABGDAOZCTIKKLMMNNSAFPTTKRST";
            string deletedChars = "";//= @" )(*&^%$#@!}{[]+|\/?.>,<~`;:-''";
            int asciiRangeFrom, asciiRangeTo, asciiRangeDelta;
            asciiRangeFrom = 1488;
            asciiRangeTo = 1488 - 224 + 250;
            asciiRangeDelta = 96;
            source = source.Replace("\"", "");

            StringBuilder output = new StringBuilder();
            for (int i = 0; i < source.Length; i++)
            {
                char currentChar = source[i];
                int asciiValue = (int)currentChar;
                if (asciiValue >= asciiRangeFrom - asciiRangeDelta && asciiValue <= asciiRangeTo - asciiRangeDelta)
                    asciiValue += asciiRangeDelta;
                if (asciiValue >= asciiRangeFrom && asciiValue <= asciiRangeTo)
                    currentChar = hebrewEngish[asciiValue - asciiRangeFrom];
                //if(currentChar==' ') currentChar = '_';
                if (deletedChars.IndexOf(currentChar) == -1)
                    output.Append(currentChar);
                if (asciiValue >= asciiRangeFrom && asciiValue <= asciiRangeTo)
                {
                    if (asciiValue == asciiRangeFrom + 7 || asciiValue == asciiRangeFrom + 10 || asciiValue == asciiRangeFrom + 25)
                        output.Append('H');
                    if (asciiValue == asciiRangeFrom + 21 || asciiValue == asciiRangeFrom + 22)
                        output.Append('S');
                    if (output.ToString().EndsWith("CH "))
                        output = output.Remove(output.Length - 3, 3).Append("ACH ");
                    if (output.Length > 1)
                    {
                        switch (output.ToString().Substring(output.Length - 2, 2))
                        {
                            case "AI":
                                output = output.Remove(output.Length - 2, 2).Append("I");
                                break;
                            case "AO":
                                output = output.Remove(output.Length - 2, 2).Append("O");
                                break;
                            case "B ":
                                output = output.Remove(output.Length - 2, 2).Append("V ");
                                break;
                            case "K ":
                                output = output.Remove(output.Length - 2, 2).Append("CH ");
                                break;
                            case "P ":
                                output = output.Remove(output.Length - 2, 2).Append("F ");
                                break;
                        }
                    }
                }
            }
            if (output.ToString().EndsWith("CH"))
                output = output.Remove(output.Length - 2, 2).Append("ACH");
            if (output.ToString().EndsWith("B"))
                output = output.Remove(output.Length - 1, 1).Append("V");
            return output.ToString();
        }
        public static bool HasHebrewInIt(string s)
        {
            foreach (char c in s)
            {
                if (c >= 'א' && c <= 'ת') return true;
            }
            return false;
        }
        internal static string MakeSingular(string name)
        {
            if (name.EndsWith("IES"))
                return name.Remove(name.Length - 3) + "Y";
            if (name.EndsWith("ies"))
                return name.Remove(name.Length - 3) + "y";
            if (name.EndsWith("S"))
                return name.Remove(name.Length - 1);
            if (name.EndsWith("s"))
                return name.Remove(name.Length - 1);
            return name + "Item";
        }
    }
}
