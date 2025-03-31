package ru.ilcorp.geometry_processing.v1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CubeShadowController {
    @GetMapping("/lab3")
    public String geometryProcessingShadow(Model model) {
        model.addAttribute("size", 100);
        return "cubeShadow";
    }
}
