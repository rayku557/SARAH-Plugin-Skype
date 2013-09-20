﻿/*
******************************************************
* File:Skype.js
* Date:26/8/2013
* Version: 1.0
* Author: Alban Vidal-Naquet (alban@albanvn.net)
* Sarah plugin for skype
******************************************************
*/

// Constantes
const cst_wscript="wscript.exe";
const cst_skypevbs="skype.vbs";
const cst_msg_unknowlast="Je ne sais pas de qui vous parler";
const cst_msg_calling="Très bien, j'appelle";
const cst_msg_callingvideo1="Très bien, j'appelle";
const cst_msg_callingvideo2="et lance la vidéo";
const cst_msg_whoisconnected="Je regarde qui est connecté";
const cst_msg_finishcall="Très bien je raccroche";
const cst_msg_isconnected_b="Je regarde si";
const cst_msg_isconnected_e="est connécté";
const cst_msg_getstatus="Je regarde votre statut skaillpe";
const cst_msg_connect="Je connecte votre compte skaillpe";
const cst_msg_busy="Je mets en occupé votre compte skaillpe";
const cst_msg_disconnect="Je déconnecte votre compte skaillpe";
const cst_msg_selectfriend="Je mets à jour votre liste d'amis";
const cst_msg_connectaccount="Je connecte le compte skaillpe";
const cst_msg_badconfiguration="Veuillez configurer correctement les paramètres du pleugue ine";
const cst_msg_fullscreen="Très bien je mets skaillpe en plein écran";
const cst_maxtimeout=20*1000;
// Global variable
var	gs_timeout=0;
var gs_calllast="";
var gs_script_skype_path="";

exports.init = function (SARAH)
{
    var cfg=SARAH.ConfigManager.getConfig();
	cfg = cfg.modules.skype
    gs_script_skype_path=__dirname + "\\" + cst_skypevbs;
    SARAH.remote({'run' : cst_wscript, 'runp' : gs_script_skype_path});
	var parameter="updateparameter \"" + __dirname + "\" \"" +cfg.Name1+"\" \""+cfg.User1+"\" \""+cfg.Pass1+"\" \""+cfg.Name2+"\" \""+cfg.User2+"\" \""+cfg.Pass2+"\" \""+cfg.Name3+"\" \""+cfg.User3+"\" \""+cfg.Pass3+"\"";
	SARAH.remote({'run' : cst_wscript, 'runp' : gs_script_skype_path + " " + parameter});
}

exports.release = function (SARAH)
{
    SARAH.remote({'run' : cst_wscript, 'runp' : gs_script_skype_path + " " + "cleanwscript"});
}

exports.action = function(data, callback, config, SARAH)
{
    if (data.mode=="call" || data.mode=="callvideo" || data.mode=="isconnected" || data.mode=="calllast" || data.mode=="calllastvideo")
    {
	   if (data.mode=="calllast" || data.mode=="calllastvideo")
	   {
		 if (Date()<gs_timeout)
	     {
	      data.name=gs_calllast;
		  data.mode="call";
	     }
		 else
		 {
		   callback({'tts': cst_msg_unknowlast})
		   data.mode="";
		 }
       }		 
       if (data.mode=="callvideo)") callback({'tts': cst_msg_callingvideo1 + " " + data.name + " " + cst_msg_callingvideo2});
	   if (data.mode=="call") callback({'tts': cst_msg_calling + " " + data.name});
       if (data.mode=="isconnected")
	   {
	     callback({'tts': cst_msg_isconnected_b + " " + data.name + " " + cst_msg_isconnected_e});
	     gs_timeout=new Date();
		 gs_timeout+=cst_maxtimeout;
	     lastcall=data.name;
	   }
	   else
	     timer=0;
	  if (data.mode!="")
        SARAH.remote({ 'run' : cst_wscript, 'runp' : gs_script_skype_path + " " + data.mode + " \"" + data.name + "\""});
    }
    else if (data.mode=="connectaccount")
	{
	  var cfg=SARAH.ConfigManager.getConfig();
	  cfg = cfg.modules.skype
	  if (cfg.Skype_path!="" && data.name!="") 
	  {
	    callback({'tts': cst_msg_connectaccount + " " + "\"" + data.name + "\""});
	    exe = cfg.Skype_path + "\\" + "Skype.exe";
        SARAH.remote({ 'run' : exe, 'runp' : "/shutdown"});
		setTimeout(function(){SARAH.remote({ 'run' : exe, 'runp' : "\"/username:" + data.login + "\" \"" + "/password:" + data.password + "\""});
		                      setTimeout(function(){SARAH.remote({ 'run' : cst_wscript, 'runp' : gs_script_skype_path + " selectfriendsilent " + __dirname + " " + "\"" + cfg.Skype_list + "\""});
							                       },10000);
							 },2000);
     }
	  else
	    callback({'tts': cst_msg_badconfiguration});
	}
	else
    {
	  var cfg=SARAH.ConfigManager.getConfig();
	  var text="";
	  cfg = cfg.modules.skype
	  optionnal="";
	  if (data.mode=="selectfriend")
	  { 
	    text=cst_msg_selectfriend;
		optionnal=" \"" + cfg.Skype_list + "\"";
      }
	  if (data.mode=="getstatus") text=cst_msg_getstatus;
	  if (data.mode=="connect") text=cst_msg_connect;
	  if (data.mode=="busy") text=cst_msg_busy;
	  if (data.mode=="disconnect") text=cst_msg_disconnect;
      if (data.mode=="listconnected") text=cst_msg_whoisconnected;
      if (data.mode=="finish") text=cst_msg_finishcall;
      if (data.mode=="fullscreen") text=cst_msg_fullscreen;
	  if (text!="") callback({'tts': text});
      SARAH.remote({ 'run' : cst_wscript, 'runp' : gs_script_skype_path + " " + data.mode + " " + __dirname + optionnal});
    }
}