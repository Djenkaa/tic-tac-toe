<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = ['ip','os','browser','game_fields','duration','player1','player2','winner'];


    public function p1()
    {
        return json_decode($this->player1, true);
    }

    public function p2()
    {
        return json_decode($this->player2, true);
    }

    public function fields()
    {
        return json_decode($this->game_fields, true);
    }

    //get client browser
    public static function get_browser($user_agent)
    {

        $browser = 'Unknown browser';

        if(strpos($user_agent, 'MSIE') !== FALSE)
            $browser =  'Internet explorer';
        elseif(strpos($user_agent, 'Trident') !== FALSE) //For Supporting IE 11
            $browser = 'Internet explorer';
        elseif(strpos($user_agent, 'Firefox') !== FALSE)
            $browser = 'Mozilla Firefox';
        elseif(strpos($user_agent, 'Chrome') !== FALSE)
            $browser = 'Google Chrome';
        elseif(strpos($user_agent, 'Opera Mini') !== FALSE)
            $browser = "Opera Mini";
        elseif(strpos($user_agent, 'Opera') !== FALSE)
            $browser = "Opera";
        elseif(strpos($user_agent, 'Safari') !== FALSE)
            $browser = "Safari";

        return $browser;

    }

    public static function get_os($user_agent)
    {
        $os_platform  = "Unknown OS Platform";

        $os_array     = array(
            '/windows nt 10/i'      =>  'Windows 10',
            '/windows nt 6.3/i'     =>  'Windows 8.1',
            '/windows nt 6.2/i'     =>  'Windows 8',
            '/windows nt 6.1/i'     =>  'Windows 7',
            '/windows nt 6.0/i'     =>  'Windows Vista',
            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
            '/windows nt 5.1/i'     =>  'Windows XP',
            '/windows xp/i'         =>  'Windows XP',
            '/windows nt 5.0/i'     =>  'Windows 2000',
            '/windows me/i'         =>  'Windows ME',
            '/win98/i'              =>  'Windows 98',
            '/win95/i'              =>  'Windows 95',
            '/win16/i'              =>  'Windows 3.11',
            '/macintosh|mac os x/i' =>  'Mac OS X',
            '/mac_powerpc/i'        =>  'Mac OS 9',
            '/linux/i'              =>  'Linux',
            '/ubuntu/i'             =>  'Ubuntu',
            '/iphone/i'             =>  'iPhone',
            '/ipod/i'               =>  'iPod',
            '/ipad/i'               =>  'iPad',
            '/android/i'            =>  'Android',
            '/blackberry/i'         =>  'BlackBerry',
            '/webos/i'              =>  'Mobile'
        );

        foreach ($os_array as $regex => $value)
            if (preg_match($regex, $user_agent)){
                $os_platform = $value;
            }

        return $os_platform;
    }
}
