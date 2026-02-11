package com.nsbm.group_04.Housekeeping.controller;

import com.nsbm.group_04.Housekeeping.entity.HouseKeeping;
import com.nsbm.group_04.Housekeeping.services.HouseKeepingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/housekeeping")
@CrossOrigin
public class HouseKeepingController {

    private final HouseKeepingService service;

    public HouseKeepingController(HouseKeepingService service) {
        this.service = service;
    }

    @PostMapping
    public HouseKeeping create(@RequestBody HouseKeeping houseKeeping) {
        return service.save(houseKeeping);
    }

    @GetMapping
    public List<HouseKeeping> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public HouseKeeping getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public HouseKeeping update(@PathVariable String id, @RequestBody HouseKeeping houseKeeping) {
        return service.update(id, houseKeeping);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.delete(id);
        return "Deleted successfully";
    }
}
