package net.dat257fish.ecomaps;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AppController {
    
	/*
	Load UI from index file at "/" route
	*/
    @RequestMapping({"/"})
	public String loadUI() {
        final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AppController.class);
		log.info("loading UI");
		return "forward:/index.html";
	}

}
